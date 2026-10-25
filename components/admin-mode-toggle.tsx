'use client'

import type { AdminMode } from '@/lib/admin-mode'
import { useState } from 'react'

type VariableStatus = {
  name: string
  label: string
  configured: boolean
}

export function AdminModeToggle({ mode, variables }: { mode: AdminMode; variables: VariableStatus[] }) {
  const [switching, setSwitching] = useState(false)
  const [error, setError] = useState('')
  const advanced = mode === 'advanced'

  async function setMode(next: AdminMode) {
    if (next === mode || switching) return
    setSwitching(true)
    setError('')
    try {
      const response = await fetch('/api/admin/mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: next }),
      })
      const data = (await response.json().catch(() => null)) as { error?: unknown } | null
      if (!response.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'The mode could not be changed.')
        setSwitching(false)
        return
      }
      window.location.assign('/profile')
    } catch {
      setError('The mode could not be changed.')
      setSwitching(false)
    }
  }

  return (
    <section className="profile-card" aria-label="Admin mode">
      <button
        className="mode-toggle"
        type="button"
        role="switch"
        aria-checked={advanced}
        disabled={switching}
        onClick={() => setMode(advanced ? 'off' : 'advanced')}
      >
        <span className="mode-toggle-copy">
          <strong>Advanced mode</strong>
          <span>{advanced ? 'On. Sign-in reads the host variables.' : 'Off. Sign-in is built in.'}</span>
        </span>
        <span className="switch" aria-hidden="true">
          <i />
        </span>
      </button>
      {error ? <p className="alert">{error}</p> : null}
      {advanced ? (
        <div className="advanced-mode">
          <p>These variables have to be set on the host before an advanced sign-in will open.</p>
          <ul>
            {variables.map((variable) => (
              <li key={variable.name}>
                <code>{variable.name}</code>
                <span>{variable.configured ? 'Set' : 'Missing'}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
