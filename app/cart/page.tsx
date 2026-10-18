import { CartView } from '@/components/cart-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bag — Rack City',
  description: 'Review the Rack City pieces in your bag before Square checkout.',
}

export default function CartPage() {
  return <CartView />
}
