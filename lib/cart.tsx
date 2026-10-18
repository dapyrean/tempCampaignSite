'use client'

import { getProduct, type BagLine } from '@/lib/catalog'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'rack-city-bag'

type CartContextValue = {
  items: BagLine[]
  count: number
  ready: boolean
  notice: string
  addItem: (slug: string, size: string, quantity?: number, mode?: 'add' | 'set') => void
  updateQuantity: (slug: string, size: string, quantity: number) => void
  removeItem: (slug: string, size: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function readBag(): BagLine[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((line) => {
      if (!line || typeof line !== 'object') return []
      const raw = line as Partial<BagLine>
      if (typeof raw.slug !== 'string' || typeof raw.size !== 'string' || !Number.isInteger(raw.quantity)) return []
      return [{ slug: raw.slug, size: raw.size, quantity: raw.quantity as number }]
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BagLine[]>([])
  const [ready, setReady] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setItems(readBag())
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, ready])

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(''), 2400)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const addItem = useCallback((slug: string, size: string, quantity = 1, mode: 'add' | 'set' = 'add') => {
    const product = getProduct(slug)
    if (!product || !product.sizes.includes(size)) return
    const nextQuantity = Math.min(8, Math.max(1, quantity))
    setItems((current) => {
      const index = current.findIndex((line) => line.slug === slug && line.size === size)
      if (index === -1) return [...current, { slug, size, quantity: nextQuantity }]
      return current.map((line, lineIndex) => {
        if (lineIndex !== index) return line
        const quantityValue = mode === 'set' ? nextQuantity : Math.min(8, line.quantity + nextQuantity)
        return { ...line, quantity: quantityValue }
      })
    })
    setNotice(`${product.name} added to bag`)
  }, [])

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((line) => {
        if (line.slug !== slug || line.size !== size) return [line]
        if (quantity < 1) return []
        return [{ ...line, quantity: Math.min(8, quantity) }]
      }),
    )
  }, [])

  const removeItem = useCallback((slug: string, size: string) => {
    setItems((current) => current.filter((line) => line.slug !== slug || line.size !== size))
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, line) => sum + line.quantity, 0),
      ready,
      notice,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, ready, notice, addItem, updateQuantity, removeItem, clear],
  )

  return (
    <CartContext.Provider value={value}>
      {children}
      {notice ? (
        <div className="toast" role="status">
          {notice}
        </div>
      ) : null}
    </CartContext.Provider>
  )
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
