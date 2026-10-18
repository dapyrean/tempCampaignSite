'use client'

import { SquareCard, type SquareCardHandle } from '@/components/square-card'
import { useCart } from '@/lib/cart'
import { formatMoney, linesTotal, resolveLines, type ResolvedLine } from '@/lib/catalog'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

type SquarePublicConfig = {
  environment: 'sandbox' | 'production'
  applicationId: string
  locationId: string
  sdkUrl: string
  hostedReady: boolean
  embeddedReady: boolean
  tokenSet: boolean
}

type BuyerForm = {
  givenName: string
  familyName: string
  email: string
  phone: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
}

const emptyBuyer: BuyerForm = {
  givenName: '',
  familyName: '',
  email: '',
  phone: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
}

const LAST_ORDER_KEY = 'rack-city-last-order'

export function CheckoutView() {
  const { items, ready } = useCart()
  const router = useRouter()
  const cardRef = useRef<SquareCardHandle>(null)
  const keys = useRef({ hash: '', key: '' })
  const [buyer, setBuyer] = useState<BuyerForm>(emptyBuyer)
  const [config, setConfig] = useState<SquarePublicConfig | null>(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState<'card' | 'link' | ''>('')

  const lines = useMemo(() => {
    if (!items.length) return [] as ResolvedLine[]
    try {
      return resolveLines(items)
    } catch {
      return [] as ResolvedLine[]
    }
  }, [items])
  const total = linesTotal(lines)

  useEffect(() => {
    let cancelled = false
    fetch('/api/square/config')
      .then((response) => response.json())
      .then((data: SquarePublicConfig) => {
        if (!cancelled) setConfig(data)
      })
      .catch(() => {
        if (!cancelled) setError('Checkout could not reach the store.')
      })
    return () => {
      cancelled = true
    }
  }, [])

  function update(key: keyof BuyerForm, value: string) {
    setBuyer((current) => ({ ...current, [key]: value }))
  }

  function idempotencyKey(method: string) {
    const hash = JSON.stringify({ method, items, buyer })
    if (keys.current.hash !== hash) keys.current = { hash, key: crypto.randomUUID() }
    return keys.current.key
  }

  function rememberOrder() {
    sessionStorage.setItem(
      LAST_ORDER_KEY,
      JSON.stringify({ lines, total, email: buyer.email, createdAt: new Date().toISOString() }),
    )
  }

  async function payWithCard(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (!cardRef.current) return
    setPending('card')
    try {
      const token = await cardRef.current.tokenize({
        amount: (total / 100).toFixed(2),
        currencyCode: 'USD',
        intent: 'CHARGE',
        billingContact: {
          givenName: buyer.givenName,
          familyName: buyer.familyName,
          email: buyer.email,
          phone: buyer.phone,
          countryCode: 'US',
          addressLines: [buyer.addressLine1],
          city: buyer.city,
          state: buyer.state,
          postalCode: buyer.postalCode,
        },
      })
      const response = await fetch('/api/square/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: token.token,
          verificationToken: token.verificationToken,
          idempotencyKey: idempotencyKey('card'),
          items,
          buyer,
        }),
      })
      const data = (await response.json()) as { error?: string; paymentId?: string; orderId?: string }
      if (!response.ok) throw new Error(data.error || 'Payment was not completed.')
      rememberOrder()
      router.push(`/checkout/confirmation?paymentId=${data.paymentId || ''}&orderId=${data.orderId || ''}`)
    } catch (payError) {
      setError(payError instanceof Error ? payError.message : 'Payment was not completed.')
      setPending('')
    }
  }

  async function payWithLink(event: React.MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form
    if (form && !form.reportValidity()) return
    setError('')
    setPending('link')
    try {
      const response = await fetch('/api/square/payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idempotencyKey: idempotencyKey('link'), items, buyer }),
      })
      const data = (await response.json()) as { error?: string; url?: string }
      if (!response.ok || !data.url) throw new Error(data.error || 'Square checkout could not be opened.')
      rememberOrder()
      window.location.href = data.url
    } catch (payError) {
      setError(payError instanceof Error ? payError.message : 'Square checkout could not be opened.')
      setPending('')
    }
  }

  if (!ready) {
    return (
      <main className="page">
        <div className="wrap">
          <p className="muted">Opening checkout…</p>
        </div>
      </main>
    )
  }

  if (!lines.length) {
    return (
      <main className="page">
        <div className="wrap empty">
          <p className="kicker">Checkout</p>
          <h1>Your bag is empty.</h1>
          <Link className="btn btn-gold" href="/shop">
            Shop the edit
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Checkout</p>
          <h1>Pay with Square.</h1>
        </header>
        <form className="checkout-grid" onSubmit={payWithCard}>
          <div className="checkout-form">
            <p className="field-label">Ship to</p>
            <div className="form-grid">
              <label className="field">
                First name
                <input required autoComplete="given-name" value={buyer.givenName} onChange={(event) => update('givenName', event.target.value)} />
              </label>
              <label className="field">
                Last name
                <input required autoComplete="family-name" value={buyer.familyName} onChange={(event) => update('familyName', event.target.value)} />
              </label>
            </div>
            <div className="form-grid">
              <label className="field">
                Email
                <input required type="email" autoComplete="email" value={buyer.email} onChange={(event) => update('email', event.target.value)} />
              </label>
              <label className="field">
                Phone
                <input required autoComplete="tel" value={buyer.phone} onChange={(event) => update('phone', event.target.value)} />
              </label>
            </div>
            <label className="field">
              Address
              <input required autoComplete="address-line1" value={buyer.addressLine1} onChange={(event) => update('addressLine1', event.target.value)} />
            </label>
            <div className="form-grid form-grid-3">
              <label className="field">
                City
                <input required autoComplete="address-level2" value={buyer.city} onChange={(event) => update('city', event.target.value)} />
              </label>
              <label className="field">
                State
                <input required maxLength={2} autoComplete="address-level1" placeholder="NY" value={buyer.state} onChange={(event) => update('state', event.target.value.toUpperCase())} />
              </label>
              <label className="field">
                Postal code
                <input required autoComplete="postal-code" value={buyer.postalCode} onChange={(event) => update('postalCode', event.target.value)} />
              </label>
            </div>

            {config?.embeddedReady ? (
              <div className="pay-block">
                <p className="field-label">Card</p>
                <SquareCard ref={cardRef} applicationId={config.applicationId} locationId={config.locationId} sdkUrl={config.sdkUrl} />
                {config.environment === 'sandbox' ? (
                  <p className="fine">Sandbox test card 4111 1111 1111 1111, any future date, any CVV, any postal code.</p>
                ) : null}
                <button className="btn btn-gold" type="submit" disabled={pending !== ''}>
                  {pending === 'card' ? 'Charging…' : `Pay ${formatMoney(total)}`}
                </button>
              </div>
            ) : null}

            {config && !config.embeddedReady ? <SetupPanel config={config} /> : null}

            {error ? <p className="alert">{error}</p> : null}

            <button className="btn btn-line" type="button" disabled={!config?.hostedReady || pending !== ''} onClick={payWithLink}>
              {pending === 'link' ? 'Opening Square…' : 'Continue on Square'}
            </button>
            <p className="fine">Continue on Square opens a Square-hosted checkout for this bag. The card form charges the same order through the Web Payments SDK.</p>
          </div>
          <aside className="summary">
            <p className="kicker">Your edit</p>
            <ul className="summary-lines">
              {lines.map((line) => (
                <li key={`${line.slug}-${line.size}`}>
                  <span>
                    {line.name}
                    <small>
                      Size {line.size} · {line.quantity}
                    </small>
                  </span>
                  <strong>{formatMoney(line.lineTotal)}</strong>
                </li>
              ))}
            </ul>
            <div className="summary-row">
              <span>Shipping</span>
              <strong>Complimentary</strong>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <strong>{formatMoney(total)}</strong>
            </div>
          </aside>
        </form>
      </div>
    </main>
  )
}

function SetupPanel({ config }: { config: SquarePublicConfig }) {
  return (
    <div className="setup">
      <p className="field-label">Connect Square</p>
      <p>Add these to <code>.env.local</code>, then restart the dev server. Card entry needs all three values. Continue on Square needs the token and location.</p>
      <ul>
        <li>SQUARE_ENVIRONMENT={config.environment}</li>
        <li>{config.tokenSet ? 'SQUARE_ACCESS_TOKEN is set' : 'SQUARE_ACCESS_TOKEN'}</li>
        <li>{config.locationId ? 'SQUARE_LOCATION_ID is set' : 'SQUARE_LOCATION_ID'}</li>
        <li>{config.applicationId ? 'SQUARE_APPLICATION_ID is set' : 'SQUARE_APPLICATION_ID'}</li>
      </ul>
    </div>
  )
}
