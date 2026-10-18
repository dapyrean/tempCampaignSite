import { ComingSoon } from '@/components/coming-soon'
import { StoreHome } from '@/components/store-home'
import { currentAdminMode, isAdmin } from '@/lib/admin'
import { adminVariableStatus } from '@/lib/admin-session'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  if (await isAdmin()) {
    return {
      title: 'Rack City — Retail Reimagined',
      description: 'Rack City is a black-and-gold clothing house. Shop the edit and pay with Square.',
    }
  }
  return {
    title: 'Rack City — Coming Soon',
    description: 'Rack City opens soon. The edit is still being dressed.',
  }
}

export default async function Page() {
  if (!(await isAdmin())) {
    const mode = await currentAdminMode()
    return <ComingSoon mode={mode} variables={mode === 'advanced' ? adminVariableStatus() : []} />
  }
  return <StoreHome />
}
