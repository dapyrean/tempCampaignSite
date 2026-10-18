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
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

type OrderResponse = {
  order?: { id?: string; total_money?: { amount?: number; currency?: string } }
}

type PaymentResponse = {
  payment?: { id?: string; status?: string; receipt_url?: string; order_id?: string }
}

export async function POST(request: Request) {
  try {
    const config = squareConfig()
    const body = (await request.json()) as {
      sourceId?: unknown
      verificationToken?: unknown
      idempotencyKey?: unknown
      items?: unknown
      buyer?: unknown
    }

    const sourceId = typeof body.sourceId === 'string' ? body.sourceId.trim() : ''
    if (!sourceId) throw new SquareError('Square did not return a card token.')
    const idempotencyKey = assertIdempotencyKey(body.idempotencyKey)
    const lines = resolveLines(parseBag(body.items))
    const buyer = parseBuyer(body.buyer)
    if (!config.embeddedReady) {
      throw new SquareError(
        'Card checkout needs SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, and SQUARE_APPLICATION_ID in .env.local.',
        503,
      )
    }

    const created = await squareRequest<OrderResponse>('/v2/orders', {
      idempotency_key: idempotencyKey,
      order: buildSquareOrder(config.locationId, lines, buyer, idempotencyKey),
    })

    const orderId = created.order?.id
    const amount = created.order?.total_money?.amount
    const currency = created.order?.total_money?.currency || 'USD'
    if (!orderId || !amount) throw new SquareError('Square did not return an order total.', 502)

    const paymentBody: Record<string, unknown> = {
      source_id: sourceId,
      idempotency_key: `${idempotencyKey}-pay`.slice(0, 45),
      amount_money: { amount, currency },
      location_id: config.locationId,
      order_id: orderId,
      autocomplete: true,
      buyer_email_address: buyer.email,
      note: 'Rack City online',
    }
    if (typeof body.verificationToken === 'string' && body.verificationToken) {
      paymentBody.verification_token = body.verificationToken
    }

    const paid = await squareRequest<PaymentResponse>('/v2/payments', paymentBody)
    return NextResponse.json({
      paymentId: paid.payment?.id || null,
      orderId: paid.payment?.order_id || orderId,
      status: paid.payment?.status || 'COMPLETED',
      receiptUrl: paid.payment?.receipt_url || null,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment could not be completed.'
    const status = error instanceof SquareError ? error.status : 400
    return NextResponse.json({ error: message }, { status })
  }
}
