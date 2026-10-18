import { ADMIN_COOKIE, adminCookieOptions } from '@/lib/admin-session'
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions(), maxAge: 0 })
  return response
}
