import { ADMIN_MODE_COOKIE, parseAdminMode } from '@/lib/admin-mode'
import { adminCookieOptions, adminVariableStatus } from '@/lib/admin-session'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const requested = typeof body?.mode === 'string' ? body.mode : ''
  if (requested !== 'off' && requested !== 'advanced') {
    return NextResponse.json({ error: 'Mode must be off or advanced.' }, { status: 400 })
  }

  const mode = parseAdminMode(requested)
  const response = NextResponse.json({
    mode,
    variables: mode === 'advanced' ? adminVariableStatus() : [],
  })
  response.cookies.set(ADMIN_MODE_COOKIE, mode, adminCookieOptions())
  return response
}
