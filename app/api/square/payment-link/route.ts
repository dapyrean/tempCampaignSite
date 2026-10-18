import { resolveLines } from '@/lib/catalog'
import {
  SquareError,
  assertIdempotencyKey,
  buildSquareOrder,
  parseBag,
  parseBuyer,
  squareConfig,
  squareRequest,
} from '@/lib/square'
import { siteOrigin } from '@/lib/site-url'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type LinkResponse = {
  payment_link?: { id?: string; url?: string; order_id?: string }
}

export async function POST(request: Request) {
  try {
    const config = squareConfig()
    const body = (await request.json()) as {
      idempotencyKey?: unknown
      items?: unknown
      buyer?: unknown
    }
    const idempotencyKey = assertIdempotencyKey(body.idempotencyKey)
    const lines = resolveLines(parseBag(body.items))
    const buyer = parseBuyer(body.buyer)
    if (!config.hostedReady) {
      throw new SquareError('Square checkout needs SQUARE_ACCESS_TOKEN and SQUARE_LOCATION_ID.', 503)
    }
    const origin = siteOrigin(request)

    const payload = {
      idempotency_key: idempotencyKey,
      description: 'Rack City',
      payment_note: 'Rack City online',
      order: buildSquareOrder(config.locationId, lines, buyer, idempotencyKey),
      pre_populated_data: {
        buyer_email: buyer.email,
        buyer_phone_number: buyer.phone.replace(/\D/g, ''),
        buyer_address: {
          first_name: buyer.givenName,
          last_name: buyer.familyName,
          address_line_1: buyer.addressLine1,
          locality: buyer.city,
          administrative_district_level_1: buyer.state,
          postal_code: buyer.postalCode,
          country: 'US',
        },
      },
      checkout_options: {
        redirect_url: `${origin}/checkout/confirmation`,
        ask_for_shipping_address: true,
      },
    }

    let created: LinkResponse
    try {
      created = await squareRequest<LinkResponse>('/v2/online-checkout/payment-links', payload)
    } catch (error) {
      const message = error instanceof Error ? error.message : ''
      if (!/redirect/i.test(message)) throw error
      const { checkout_options, ...withoutRedirect } = payload
      void checkout_options
      created = await squareRequest<LinkResponse>('/v2/online-checkout/payment-links', {
        ...withoutRedirect,
        idempotency_key: `${idempotencyKey}-b`.slice(0, 45),
      })
    }

    if (!created.payment_link?.url) throw new SquareError('Square did not return a checkout link.', 502)
    return NextResponse.json({
      url: created.payment_link.url,
      orderId: created.payment_link.order_id || null,
      id: created.payment_link.id || null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Square checkout could not be opened.'
    const status = error instanceof SquareError ? error.status : 400
    return NextResponse.json({ error: message }, { status })
  }
}
