function isLocalHost(host: string) {
  const name = host.split(':')[0]?.replace(/^\[|\]$/g, '').toLowerCase()
  return name === 'localhost' || name === '127.0.0.1' || name === '0.0.0.0' || name === '::1'
}

function configuredOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!configured) return null
  try {
    const url = new URL(configured)
    if (isLocalHost(url.host)) return null
    return url.origin
  } catch {
    return null
  }
}

function vercelOrigin() {
  const host = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
  return host ? `https://${host}` : null
}

// Square has to send the buyer back to the public https host. On Vercel that is
// the forwarded host (custom domain or deployment URL), not localhost.
export function siteOrigin(request?: Request) {
  if (request) {
    const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || '').split(',')[0]?.trim()
    if (host && !isLocalHost(host)) {
      const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https'
      return `${proto}://${host}`
    }
  }

  return configuredOrigin() || vercelOrigin() || 'http://localhost:3000'
}
