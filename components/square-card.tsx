'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

type TokenizeResult = { status?: string; token?: string; errors?: Array<{ message?: string }> }
type Verification = { token?: string }
type Card = { attach: (selector: string) => Promise<void>; tokenize: () => Promise<TokenizeResult>; destroy: () => Promise<void> }
type Payments = {
  card: (options?: { style?: Record<string, Record<string, string>> }) => Promise<Card>
  verifyBuyer: (token: string, details: Record<string, unknown>) => Promise<Verification>
}

declare global {
  interface Window {
    Square?: { payments: (applicationId: string, locationId: string) => Payments }
  }
}

export type SquareCardHandle = {
  tokenize: (details: Record<string, unknown>) => Promise<{ token: string; verificationToken?: string }>
}

const cardStyle = {
  '.input-container': { borderColor: '#3d3220', borderRadius: '0px' },
  '.input-container.is-focus': { borderColor: '#e6c98a' },
  '.input-container.is-error': { borderColor: '#c45c4a' },
  '.message-text': { color: '#b7ad9e' },
  '.message-icon': { color: '#e6c98a' },
  input: { backgroundColor: '#101010', color: '#f4efe6', fontSize: '16px' },
  'input::placeholder': { color: '#7d756a' },
  'input.is-error': { color: '#f4efe6' },
}

function loadSquare(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (window.Square) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('Square failed to load.')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Square failed to load.'))
    document.head.appendChild(script)
  })
}

export const SquareCard = forwardRef<SquareCardHandle, { applicationId: string; locationId: string; sdkUrl: string }>(
  function SquareCard({ applicationId, locationId, sdkUrl }, ref) {
    const paymentsRef = useRef<Payments | null>(null)
    const cardRef = useRef<Card | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
      let cancelled = false
      loadSquare(sdkUrl)
        .then(async () => {
          if (cancelled || !window.Square) return
          const payments = window.Square.payments(applicationId, locationId)
          paymentsRef.current = payments
          const card = await payments.card({ style: cardStyle })
          if (cancelled) {
            await card.destroy()
            return
          }
          cardRef.current = card
          await card.attach('#square-card')
        })
        .catch((loadError: unknown) => {
          if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Square failed to load.')
        })

      return () => {
        cancelled = true
        const card = cardRef.current
        cardRef.current = null
        void card?.destroy()
      }
    }, [applicationId, locationId, sdkUrl])

    useImperativeHandle(ref, () => ({
      async tokenize(details) {
        const card = cardRef.current
        const payments = paymentsRef.current
        if (!card || !payments) throw new Error('The card form is still loading.')
        const result = await card.tokenize()
        if (result.status !== 'OK' || !result.token) {
          throw new Error(result.errors?.[0]?.message || 'Check the card details and try again.')
        }
        const verification = await payments.verifyBuyer(result.token, details)
        return { token: result.token, verificationToken: verification.token }
      },
    }))

    return (
      <div className="square-wrap">
        <div id="square-card" />
        {error ? <p className="alert">{error}</p> : null}
      </div>
    )
  },
)
