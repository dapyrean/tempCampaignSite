import type { ResolvedLine } from '@/lib/catalog'

export type Buyer = {
  givenName: string
  familyName: string
  email: string
  phone: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
}

type SquareErrorBody = {
  errors?: Array<{ detail?: string; code?: string }>
}

export class SquareError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.status = status
  }
}

const SQUARE_VERSION = '2025-10-16'

export function squareConfig() {
  const environment = process.env.SQUARE_ENVIRONMENT === 'production' ? 'production' : 'sandbox'
  const accessToken = process.env.SQUARE_ACCESS_TOKEN?.trim() || ''
  const locationId = process.env.SQUARE_LOCATION_ID?.trim() || ''
  const applicationId = process.env.SQUARE_APPLICATION_ID?.trim() || ''
  const production = environment === 'production'

  return {
    environment,
    accessToken,
    locationId,
    applicationId,
    baseUrl: production ? 'https://connect.squareup.com' : 'https://connect.squareupsandbox.com',
    sdkUrl: production ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js',
    hostedReady: Boolean(accessToken && locationId),
    embeddedReady: Boolean(accessToken && locationId && applicationId),
  }
}

export async function squareRequest<T>(path: string, body: unknown): Promise<T> {
  const config = squareConfig()
  if (!config.accessToken) {
    throw new SquareError('Square is not connected. Set SQUARE_ACCESS_TOKEN in the hosting environment.', 503)
  }

  const response = await fetch(`${config.baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      'Content-Type': 'application/json',
      'Square-Version': SQUARE_VERSION,
    },
    body: JSON.stringify(body),
  })

  const data = (await response.json().catch(() => ({}))) as T & SquareErrorBody
  if (!response.ok) {
    const detail = data.errors?.map((error) => error.detail).filter(Boolean).join(' ')
    throw new SquareError(detail || `Square returned ${response.status}.`, response.status >= 500 ? 502 : 400)
  }
  return data
}

function field(input: Record<string, unknown>, key: string, label: string, max = 80) {
  const value = typeof input[key] === 'string' ? input[key].trim() : ''
  if (!value) throw new SquareError(`${label} is required.`)
  if (value.length > max) throw new SquareError(`${label} is too long.`)
  return value
}

export function parseBuyer(input: unknown): Buyer {
  if (!input || typeof input !== 'object') throw new SquareError('Add a shipping address to continue.')
  const raw = input as Record<string, unknown>
  const email = field(raw, 'email', 'Email', 120)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new SquareError('Enter a valid email.')
  const state = field(raw, 'state', 'State', 2).toUpperCase()
  if (!/^[A-Z]{2}$/.test(state)) throw new SquareError('Use a two-letter state code.')

  return {
    givenName: field(raw, 'givenName', 'First name'),
    familyName: field(raw, 'familyName', 'Last name'),
    email,
    phone: field(raw, 'phone', 'Phone', 24),
    addressLine1: field(raw, 'addressLine1', 'Address', 120),
    city: field(raw, 'city', 'City'),
    state,
    postalCode: field(raw, 'postalCode', 'Postal code', 12),
  }
}

export function parseBag(input: unknown) {
  if (!Array.isArray(input)) throw new SquareError('Your bag is empty.')
  return input.map((item) => {
    if (!item || typeof item !== 'object') throw new SquareError('A bag line is invalid.')
    const raw = item as Record<string, unknown>
    return {
      slug: typeof raw.slug === 'string' ? raw.slug : '',
      size: typeof raw.size === 'string' ? raw.size : '',
      quantity: Number(raw.quantity),
    }
  })
}

export function assertIdempotencyKey(value: unknown) {
  if (typeof value !== 'string' || !/^[0-9a-f-]{16,44}$/i.test(value)) {
    throw new SquareError('Missing a valid idempotency key.')
  }
  return value
}

function squarePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+1${digits}`
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`
  return phone
}

export function buildSquareOrder(locationId: string, lines: ResolvedLine[], buyer: Buyer, referenceId: string) {
  return {
    location_id: locationId,
    reference_id: referenceId.slice(0, 40),
    metadata: { channel: 'rack-city-web' },
    line_items: lines.map((line) => ({
      name: `${line.name} — ${line.size}`,
      quantity: String(line.quantity),
      base_price_money: { amount: line.unitPrice, currency: 'USD' },
    })),
    fulfillments: [
      {
        type: 'SHIPMENT',
        state: 'PROPOSED',
        shipment_details: {
          recipient: {
            display_name: `${buyer.givenName} ${buyer.familyName}`,
            email_address: buyer.email,
            phone_number: squarePhone(buyer.phone),
            address: {
              address_line_1: buyer.addressLine1,
              locality: buyer.city,
              administrative_district_level_1: buyer.state,
              postal_code: buyer.postalCode,
              country: 'US',
            },
          },
        },
      },
    ],
  }
}


