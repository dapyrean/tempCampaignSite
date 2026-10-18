'use client'

import { useCart } from '@/lib/cart'
import { formatMoney, linesTotal, type ResolvedLine } from '@/lib/catalog'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

type StoredOrder = {
  lines: ResolvedLine[]
  total: number
  email: string
}

export function ConfirmationView() {
  const params = useSearchParams()
  const { clear } = useCart()
  const cleared = useRef(false)
  const [order, setOrder] = useState<StoredOrder | null>(null)
  const paymentId = params.get('paymentId') || params.get('transactionId') || ''
  const orderId = params.get('orderId') || ''

  useEffect(() => {
    const raw = sessionStorage.getItem('rack-city-last-order')
    if (raw) {
      try {
        setOrder(JSON.parse(raw) as StoredOrder)
      } catch {
        setOrder(null)
      }
    }
    if ((paymentId || orderId) && !cleared.current) {
      cleared.current = true
      clear()
    }
  }, [clear, orderId, paymentId])

  const paid = Boolean(paymentId || orderId)

  return (
    <main className="page">
      <div className="wrap confirm">
        <p className="tagline">
          <span />
          Retail reimagined.
          <span />
        </p>
        <h1>{paid ? 'The order is with Square.' : 'No payment on this page.'}</h1>
        {paid ? (
          <p className="lede">
            {order?.email ? `A receipt is on its way to ${order.email}, and the order is in your Square dashboard.` : 'The payment is recorded in your Square dashboard.'}
          </p>
        ) : (
          <p className="lede">This page is the return point after Square checkout. Your bag is unchanged.</p>
        )}
        {orderId ? <p className="receipt-id">Order {orderId}</p> : null}
        {paymentId ? <p className="receipt-id">Payment {paymentId}</p> : null}
        {order?.lines?.length ? (
          <ul className="summary-lines confirm-lines">
            {order.lines.map((line) => (
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
        ) : null}
        {order ? (
          <p className="price">
            {formatMoney(order.total || linesTotal(order.lines || []))}
          </p>
        ) : null}
        <Link className="btn btn-gold" href="/shop">
          Return to the edit
        </Link>
      </div>
    </main>
  )
}
