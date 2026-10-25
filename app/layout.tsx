import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { currentAdminMode, isAdmin } from '@/lib/admin'
import { CartProvider } from '@/lib/cart'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Convergence, Cormorant_Garamond, Outfit, Ramabhadra } from 'next/font/google'
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

const ramabhadra = Ramabhadra({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ramabhadra',
  display: 'swap',
})

const convergence = Convergence({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-convergence',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rack City — Retail Reimagined',
  description: 'Rack City is a black-and-gold clothing house. Shop the edit and pay with Square.',
  icons: { icon: '/brand/rack-city-mark.png', apple: '/brand/rack-city-mark.png' },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#050505',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await isAdmin()
  const adminMode = await currentAdminMode()

  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${ramabhadra.variable} ${convergence.variable}`} data-admin-mode={adminMode}>
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
