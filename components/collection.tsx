'use client'

import { ProductCard } from '@/components/product-card'
import { categories, products } from '@/lib/catalog'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Collection({
  category,
  query = '',
  limit,
  syncUrl = false,
}: {
  category?: string
  query?: string
  limit?: number
  syncUrl?: boolean
}) {
  const router = useRouter()
  const [active, setActive] = useState(category || 'All')

  useEffect(() => {
    setActive(category || 'All')
  }, [category])

  function select(next: string) {
    setActive(next)
    if (!syncUrl) return
    const params = new URLSearchParams()
    if (next !== 'All') params.set('category', next)
    if (query) params.set('q', query)
    const href = params.size ? `/shop?${params}` : '/shop'
    router.replace(href, { scroll: false })
  }

  const needle = query.trim().toLowerCase()
  const filtered = products.filter((product) => {
    const categoryMatch = active === 'All' || product.category === active
    if (!categoryMatch) return false
    if (!needle) return true
    return `${product.name} ${product.edition} ${product.category} ${product.summary}`.toLowerCase().includes(needle)
  })
  const visible = typeof limit === 'number' ? filtered.slice(0, limit) : filtered

  return (
    <div>
      <div className="filters" role="tablist" aria-label="Categories">
        {categories.map((item) => (
          <button className={item === active ? 'filter is-active' : 'filter'} type="button" key={item} onClick={() => select(item)}>
            {item}
          </button>
        ))}
      </div>
      {needle ? (
        <p className="result-count">
          {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} for “{query.trim()}”
        </p>
      ) : null}
      {visible.length === 0 ? (
        <div className="empty">
          <p>Nothing in this edit matches.</p>
        </div>
      ) : (
        <div className="grid">
          {visible.map((product) => (
            <ProductCard product={product} key={product.slug} />
          ))}
        </div>
      )}
    </div>
  )
}
