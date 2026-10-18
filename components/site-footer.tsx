import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <img src="/brand/rack-city-logo.jpg" alt="Rack City. Retail reimagined." />
          <p className="tagline">
            <span />
            Retail reimagined.
            <span />
          </p>
        </div>
        <div className="footer-links">
          <Link href="/shop">The edit</Link>
          <Link href="/shop?category=Women">Women</Link>
          <Link href="/shop?category=Men">Men</Link>
          <Link href="/shop?category=Objects">Objects</Link>
          <Link href="/#flagship">Flagship</Link>
          <Link href="/checkout">Checkout</Link>
        </div>
        <div className="footer-note">
          <p>SoHo, New York</p>
          <p>Payments are taken by Square. Cards are entered on Square, not stored by this site.</p>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Rack City</span>
        <span>New York</span>
      </div>
    </footer>
  )
}
