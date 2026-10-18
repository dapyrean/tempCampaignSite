'use client'

import type { AdminMode } from '@/lib/admin-mode'
import { FormEvent, useState } from 'react'

type VariableStatus = {
  name: string
  label: string
  configured: boolean
}

export function ComingSoon({ mode, variables }: { mode: AdminMode; variables: VariableStatus[] }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [switching, setSwitching] = useState(false)

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
      if (!response.ok) {
        setError('The mode flag could not be changed.')
        setSwitching(false)
        return
      }
      window.location.assign('/')
    } catch {
      setError('The mode flag could not be changed.')
      setSwitching(false)
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = (await response.json().catch(() => null)) as { error?: unknown } | null
      if (!response.ok) {
        setError(typeof data?.error === 'string' ? data.error : 'That sign-in was not recognized.')
        setPending(false)
        return
      }
      window.location.assign('/')
    } catch {
      setError('The floor could not be reached. Try again.')
      setPending(false)
    }
  }

  return (
    <main className="soon" data-admin-mode={mode}>
      <div className="soon-inner">
        <img className="hero-logo" src="/brand/rack-city-logo.jpg" width={220} height={288} alt="Rack City logo: a gold hanger shaped into a city skyline" />
        <p className="tagline">
          <span />
          Retail reimagined.
          <span />
        </p>
        <h1>
          Coming
          <br />
          <em>soon.</em>
        </h1>
        <p className="lede">The floor is still being dressed. The edit opens after dark.</p>
        <p className="soon-place">SoHo, New York</p>

        <form className="soon-form" onSubmit={onSubmit}>
          <p className="kicker">Admin</p>
          <label className="field">
            Username
            <input name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label className="field">
            Password
            <input name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error ? <p className="alert">{error}</p> : null}
          <button className="btn btn-gold" type="submit" disabled={pending || switching}>
            {pending ? 'Opening' : 'Sign in'}
          </button>
        </form>

        <div className="mode-flag" data-admin-mode={mode}>
          <p className="kicker">Admin mode</p>
          <div className="mode-switch" role="group" aria-label="Admin mode">
            <button type="button" aria-pressed={mode === 'off'} disabled={switching || mode === 'off'} onClick={() => setMode('off')}>
              Off
            </button>
            <button type="button" aria-pressed={mode === 'advanced'} disabled={switching || mode === 'advanced'} onClick={() => setMode('advanced')}>
              Advanced
            </button>
          </div>
          {mode === 'advanced' ? (
            <section className="advanced-mode" aria-label="Environment variables">
              <p>Advanced reads the sign-in from these host variables.</p>
              <ul>
                {variables.map((variable) => (
                  <li key={variable.name}>
                    <code>{variable.name}</code>
                    <span>{variable.configured ? 'Set' : 'Missing'}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <p className="mode-note">Off. Sign-in is built in. Advanced brings back the variable names.</p>
          )}
        </div>
      </div>
    </main>
  )
}
