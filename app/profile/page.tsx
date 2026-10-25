import { AdminModeToggle } from '@/components/admin-mode-toggle'
import { currentAdminMode } from '@/lib/admin'
import { adminVariableStatus } from '@/lib/admin-session'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile — Rack City',
  description: 'Account profile for the Rack City floor.',
}

export default async function ProfilePage() {
  const mode = await currentAdminMode()

  return (
    <main className="page">
      <div className="wrap">
        <header className="page-head">
          <p className="kicker">Account</p>
          <h1>Profile.</h1>
        </header>
        <AdminModeToggle mode={mode} variables={adminVariableStatus()} />
      </div>
    </main>
  )
}
