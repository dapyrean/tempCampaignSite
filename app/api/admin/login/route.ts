import { currentAdminMode } from '@/lib/admin'
import { ADMIN_COOKIE, adminCookieOptions, createSessionToken, credentialsMatch } from '@/lib/admin-session'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const username = typeof body?.username === 'string' ? body.username : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  const mode = await currentAdminMode()

  if (!credentialsMatch(username, password, mode)) {
    return NextResponse.json({ error: 'That sign-in was not recognized.' }, { status: 401 })
  }

  const token = await createSessionToken(mode)
  if (!token) {
    return NextResponse.json({ error: 'Admin sign-in is not configured.' }, { status: 500 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions())
  return response
}
