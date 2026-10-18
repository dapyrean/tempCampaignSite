'use client'

import { useState } from 'react'

export function AdminSignOut() {
  const [pending, setPending] = useState(false)

  async function signOut() {
    setPending(true)
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => null)
    window.location.assign('/')
  }

  return (
    <button className="sign-out" type="button" onClick={signOut} disabled={pending}>
      Sign out
    </button>
  )
}
