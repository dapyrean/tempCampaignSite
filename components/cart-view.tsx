'use client'

import { useCart } from '@/lib/cart'
import { formatMoney, linesTotal, resolveLines, type ResolvedLine } from '@/lib/catalog'
import { Minus, Plus, X } from 'lucide-react'
import Link from 'next/link'

export function CartView() {
  const { items, ready, updateQuantity, removeItem } = useCart()
  let lines: ResolvedLine[] = []
  let problem = ''
  if (items.length) {
    try {
      lines = resolveLines(items)
    } catch (error) {
      problem = error instanceof Error ? error.message : 'This bag needs a look.'
    }
  }
  const total = linesTotal(lines)

  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">The bag</p>
          <h1>Pieces you are holding.</h1>
        </header>
        {!ready ? <p className="muted">Opening your bag…</p> : null}
        {ready && lines.length === 0 ? (
          <div className="empty">
            <p>{problem || 'The bag is empty.'}</p>
            <Link className="btn btn-gold" href="/shop">
              Shop the edit
            </Link>
          </div>
        ) : null}
        {lines.length > 0 ? (
          <div className="cart-layout">
            <ul className="cart-list">
              {lines.map((line) => (
                <li className="cart-line" key={`${line.slug}-${line.size}`}>
                  <Link href={`/product/${line.slug}`}>
                    <img src={line.image} alt={line.imageAlt} />
                  </Link>
                  <div>
                    <p className="edition">{line.category}</p>
                    <h2>
                      <Link href={`/product/${line.slug}`}>{line.name}</Link>
                    </h2>
                    <p className="muted">Size {line.size}</p>
                    <div className="qty">
                      <button type="button" aria-label={`Decrease ${line.name}`} onClick={() => updateQuantity(line.slug, line.size, line.quantity - 1)}>
                        <Minus />
                      </button>
                      <span>{line.quantity}</span>
                      <button type="button" aria-label={`Increase ${line.name}`} onClick={() => updateQuantity(line.slug, line.size, line.quantity + 1)}>
                        <Plus />
                      </button>
                    </div>
                  </div>
                  <div className="line-end">
                    <strong>{formatMoney(line.lineTotal)}</strong>
                    <button className="text-remove" type="button" onClick={() => removeItem(line.slug, line.size)}>
                      <X /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <aside className="summary">
              <p className="kicker">Order</p>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong>{formatMoney(total)}</strong>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <strong>Complimentary</strong>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <strong>{formatMoney(total)}</strong>
              </div>
              <p className="fine">Taxes, if your Square location collects them, are added when the payment is created.</p>
              <Link className="btn btn-gold" href="/checkout">
                Checkout with Square
              </Link>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  )
}
