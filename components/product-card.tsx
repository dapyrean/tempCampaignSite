'use client'

import { useCart } from '@/lib/cart'
import { formatMoney, type Product } from '@/lib/catalog'
import Link from 'next/link'
import { useState } from 'react'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [size, setSize] = useState(product.sizes[0])

  return (
    <article className="card">
      <Link className="card-media" href={`/product/${product.slug}`}>
        <img src={product.image} alt={product.imageAlt} />
        {product.badge ? <span className="badge">{product.badge}</span> : null}
      </Link>
      <div className="card-body">
        <p className="edition">{product.edition}</p>
        <div className="card-title">
          <h3>
            <Link href={`/product/${product.slug}`}>{product.name}</Link>
          </h3>
          <strong>{formatMoney(product.price)}</strong>
        </div>
        <div className="sizes" role="listbox" aria-label={`Size for ${product.name}`}>
          {product.sizes.map((option) => (
            <button className={option === size ? 'size is-selected' : 'size'} type="button" key={option} onClick={() => setSize(option)} aria-pressed={option === size}>
              {option}
            </button>
          ))}
        </div>
        <button className="btn btn-line" type="button" onClick={() => addItem(product.slug, size, 1)}>
          Add to bag
        </button>
      </div>
    </article>
  )
}
