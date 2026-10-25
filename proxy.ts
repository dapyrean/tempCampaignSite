import { ADMIN_MODE_COOKIE, parseAdminMode } from '@/lib/admin-mode'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.[a-zA-Z0-9]+$/

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname === '/' ||
    pathname === '/admin' ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/logout' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const mode = parseAdminMode(request.cookies.get(ADMIN_MODE_COOKIE)?.value)
  if (await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value, mode)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
