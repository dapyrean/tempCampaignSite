import { ProductDetail } from '@/components/product-detail'
import { getProduct } from '@/lib/catalog'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: 'Not found — Rack City' }
  return { title: `${product.name} — Rack City`, description: product.summary }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
