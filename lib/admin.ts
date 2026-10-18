import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/admin-session'

export async function isAdmin() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value)
}
