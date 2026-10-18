import { ConfirmationView } from '@/components/confirmation-view'
import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Order confirmed — Rack City',
  description: 'Your Rack City order has been sent to Square.',
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <div className="wrap">
            <p className="muted">Opening your receipt…</p>
          </div>
        </main>
      }
    >
      <ConfirmationView />
    </Suspense>
  )
}
