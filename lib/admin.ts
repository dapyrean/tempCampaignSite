import { ADMIN_MODE_COOKIE, parseAdminMode, type AdminMode } from '@/lib/admin-mode'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session'
import { cookies } from 'next/headers'

export async function currentAdminMode(): Promise<AdminMode> {
  const cookieStore = await cookies()
  return parseAdminMode(cookieStore.get(ADMIN_MODE_COOKIE)?.value)
}

export async function isAdmin() {
  const cookieStore = await cookies()
  const mode = parseAdminMode(cookieStore.get(ADMIN_MODE_COOKIE)?.value)
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value, mode)
}
