export const ADMIN_COOKIE = 'rack_city_admin'
const SESSION_SECONDS = 60 * 60 * 24 * 7

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_SECONDS,
  }
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim()
  return secret || null
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function safeEqual(left: string, right: string) {
  const a = new TextEncoder().encode(left)
  const b = new TextEncoder().encode(right)
  const length = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0)
  return diff === 0
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return toBase64Url(new Uint8Array(signature))
}

export function credentialsMatch(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME?.trim() ?? ''
  const expectedPass = process.env.ADMIN_PASSWORD ?? ''
  if (!expectedUser || !expectedPass) return false
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPass)
}

export async function createSessionToken() {
  const secret = sessionSecret()
  if (!secret) return null
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ exp })))
  const signature = await sign(payload, secret)
  return `${payload}.${signature}`
}

export async function verifySessionToken(token: string | undefined) {
  const secret = sessionSecret()
  if (!secret || !token) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payload, signature] = parts
  if (!payload || !signature) return false
  const expected = await sign(payload, secret)
  if (!safeEqual(signature, expected)) return false
  try {
    const data = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as { exp?: unknown }
    return typeof data.exp === 'number' && data.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
