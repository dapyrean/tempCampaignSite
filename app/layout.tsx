import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { isAdmin } from '@/lib/admin'
import { CartProvider } from '@/lib/cart'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

const sans = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rack City — Retail Reimagined',
  description: 'Rack City is a black-and-gold clothing house. Shop the edit and pay with Square.',
  icons: { icon: '/brand/rack-city-logo.jpg', apple: '/brand/rack-city-logo.jpg' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050505',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await isAdmin()

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {admin ? (
          <CartProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </CartProvider>
        ) : (
          children
        )}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
