'use client'

import { FormEvent, useState } from 'react'

export function ComingSoon() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

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
    <main className="soon">
      <div className="soon-inner">
        <img className="soon-mark" src="/brand/rack-city-mark.png" width={1680} height={1206} alt="" />
        <h1 className="soon-wordmark">Rack City</h1>
        <p className="soon-tagline">
          <span />
          Retail reimagined
          <span />
        </p>
        <p className="soon-status">Coming soon</p>
        <p className="soon-place">SoHo, New York</p>

        <form className="soon-form" onSubmit={onSubmit}>
          <p className="kicker">Staff</p>
          <label className="field">
            Username
            <input name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label className="field">
            Password
            <input name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error ? <p className="alert">{error}</p> : null}
          <button className="btn btn-gold" type="submit" disabled={pending}>
            {pending ? 'Opening' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
