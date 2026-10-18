import { squareConfig } from '@/lib/square'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  const config = squareConfig()
  return NextResponse.json({
    environment: config.environment,
    applicationId: config.applicationId,
    locationId: config.locationId,
    sdkUrl: config.sdkUrl,
    hostedReady: config.hostedReady,
    embeddedReady: config.embeddedReady,
    tokenSet: Boolean(config.accessToken),
  })
}
