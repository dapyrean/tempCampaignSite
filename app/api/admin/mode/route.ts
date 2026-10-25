import { ADMIN_MODE_COOKIE, parseAdminMode } from '@/lib/admin-mode'
import { ADMIN_COOKIE, adminCookieOptions, adminVariableStatus, createSessionToken, verifySessionToken } from '@/lib/admin-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const current = parseAdminMode(cookieStore.get(ADMIN_MODE_COOKIE)?.value)
  const signedIn = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value, current)
  if (!signedIn) {
    return NextResponse.json({ error: 'Sign in before changing the mode.' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const requested = typeof body?.mode === 'string' ? body.mode : ''
  if (requested !== 'off' && requested !== 'advanced') {
    return NextResponse.json({ error: 'Mode must be off or advanced.' }, { status: 400 })
  }

  const mode = parseAdminMode(requested)
  const token = await createSessionToken(mode)
  if (!token) {
    return NextResponse.json({ error: 'Advanced mode needs ADMIN_SESSION_SECRET before it can be turned on.' }, { status: 400 })
  }

  const response = NextResponse.json({
    mode,
    variables: mode === 'advanced' ? adminVariableStatus() : [],
  })
  response.cookies.set(ADMIN_MODE_COOKIE, mode, adminCookieOptions())
  response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions())
  return response
}
