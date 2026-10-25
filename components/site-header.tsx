'use client'

import { AdminSignOut } from '@/components/admin-sign-out'
import { useCart } from '@/lib/cart'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const links = [
  { href: '/shop', label: 'Shop' },
  { href: '/shop?category=Women', label: 'Women' },
  { href: '/shop?category=Men', label: 'Men' },
  { href: '/shop?category=Objects', label: 'Objects' },
  { href: '/#flagship', label: 'Flagship' },
]

export function SiteHeader() {
  const { count } = useCart()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className={open ? 'header is-open' : 'header'}>
      <div className="header-inner wrap">
        <div className="header-left">
        <button className="menu-button" type="button" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen((value) => !value)}>
          {open ? <X /> : <Menu />}
        </button>
        <Link className="brand" href="/" aria-label="Rack City home">
          <img className="brand-mark" src="/brand/rack-city-mark.png" alt="" />
          <span className="brand-lockup">
            <span className="brand-name">Rack City</span>
            <span className="brand-tag">Retail reimagined</span>
          </span>
        </Link>
        </div>
        <nav className={open ? 'nav is-open' : 'nav'} aria-label="Main">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <form className="search search-mobile" action="/shop">
            <Search />
            <input name="q" placeholder="Search the edit" aria-label="Search the edit" />
          </form>
          <Link className="profile-link" href="/profile">
            Profile
          </Link>
          <AdminSignOut />
        </nav>
        <div className="header-tools">
          <form className="search" action="/shop">
            <Search />
            <input name="q" placeholder="Search" aria-label="Search the edit" />
          </form>
          <Link className="profile-link" href="/profile">
            Profile
          </Link>
          <AdminSignOut />
          <Link className="bag" href="/cart" aria-label={`Bag, ${count} ${count === 1 ? 'piece' : 'pieces'}`}>
            <ShoppingBag />
            <span>{String(count).padStart(2, '0')}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
