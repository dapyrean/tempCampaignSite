import { AdminLogin } from '@/components/admin-login'
import { isAdmin } from '@/lib/admin'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Staff — Rack City',
  description: 'Staff sign-in for Rack City.',
}

export default async function AdminPage() {
  if (await isAdmin()) redirect('/')

  return (
    <main className="soon admin-gate">
      <AdminLogin />
    </main>
  )
}
