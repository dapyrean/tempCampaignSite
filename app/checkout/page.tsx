import { CheckoutView } from '@/components/checkout-view'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout — Rack City',
  description: 'Pay for your Rack City order with Square.',
}

export default function CheckoutPage() {
  return <CheckoutView />
}
