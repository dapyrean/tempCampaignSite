import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_FILE = /\.[a-zA-Z0-9]+$/

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/' || pathname === '/api/admin/login' || pathname === '/api/admin/logout' || PUBLIC_FILE.test(pathname)) {
    return NextResponse.next()
  }

  if (await verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
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
