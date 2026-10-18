import { Collection } from '@/components/collection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop the edit — Rack City',
  description: 'Women, men, and objects from the Rack City edit.',
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const params = await searchParams
  const title = params.q ? `Results for “${params.q}”` : params.category ? params.category : 'The full edit'

  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Shop</p>
          <h1>{title}.</h1>
        </header>
        <Collection category={params.category} query={params.q || ''} syncUrl />
      </div>
    </main>
  )
}
