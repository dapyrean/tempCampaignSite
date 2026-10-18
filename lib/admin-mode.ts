export const ADMIN_MODE_COOKIE = 'rack_city_admin_mode'

export const ADMIN_VARIABLES = [
  { name: 'ADMIN_USERNAME', label: 'Username' },
  { name: 'ADMIN_PASSWORD', label: 'Password' },
  { name: 'ADMIN_SESSION_SECRET', label: 'Session secret' },
] as const

export type AdminMode = 'off' | 'advanced'

export function parseAdminMode(value: string | undefined | null): AdminMode {
  return value === 'advanced' ? 'advanced' : 'off'
}
