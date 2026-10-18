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
      if (!response.ok) {
        setError('That sign-in was not recognized.')
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
          <button className="btn btn-gold" type="submit" disabled={pending}>
            {pending ? 'Opening' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
