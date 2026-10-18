'use client'

import { ProductCard } from '@/components/product-card'
import { useCart } from '@/lib/cart'
import { formatMoney, relatedProducts, type Product } from '@/lib/catalog'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart()
  const router = useRouter()
  const [size, setSize] = useState(product.sizes[0])
  const [quantity, setQuantity] = useState(1)
  const related = relatedProducts(product.slug)

  return (
    <main className="page">
      <div className="wrap product-layout">
        <div className="gallery">
          <img src={product.image} alt={product.imageAlt} />
        </div>
        <div className="product-copy">
          <p className="kicker">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="edition">{product.edition}</p>
          <p className="price">{formatMoney(product.price)}</p>
          <p className="lede">{product.description}</p>
          <p className="field-label">Size</p>
          <div className="sizes" role="listbox" aria-label="Size">
            {product.sizes.map((option) => (
              <button className={option === size ? 'size is-selected' : 'size'} type="button" key={option} onClick={() => setSize(option)} aria-pressed={option === size}>
                {option}
              </button>
            ))}
          </div>
          <label className="field qty-field">
            Quantity
            <input
              type="number"
              min={1}
              max={8}
              value={quantity}
              onChange={(event) => setQuantity(Math.min(8, Math.max(1, Number(event.target.value) || 1)))}
            />
          </label>
          <div className="product-actions">
            <button className="btn btn-gold" type="button" onClick={() => addItem(product.slug, size, quantity)}>
              Add to bag
            </button>
            <button
              className="btn btn-line"
              type="button"
              onClick={() => {
                addItem(product.slug, size, quantity, 'set')
                router.push('/checkout')
              }}
            >
              Buy now
            </button>
          </div>
          <ul className="detail-list">
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <p className="fine">Complimentary shipping in the US. Payment is completed with Square.</p>
        </div>
      </div>
      <section className="section wrap">
        <div className="section-head">
          <p className="kicker">Also in the edit</p>
          <h2>Worn with this.</h2>
        </div>
        <div className="grid">
          {related.map((item) => (
            <ProductCard product={item} key={item.slug} />
          ))}
        </div>
      </section>
    </main>
  )
}
