import UserMenu from './UserMenu'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import OrchestraSwitcher from './OrchestraSwitcher'

export default async function Header() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="text-lg font-semibold">Cadenza</div>

        <nav className="flex items-center gap-6">
          <a href="/dashboard">Dashboard</a>
          <a href="/rehearsals">Rehearsals</a>
          <a href="/members">Members</a>
        </nav>
      </header>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const displayName = profile?.full_name || user.email
  
  const cookieStore = await cookies()
  const activeOrchestraId = cookieStore.get('active_orchestra_id')?.value

  const { data } = await supabase
    .from('members')
    .select(`
      orchestra_id,
      orchestras (
        id,
        name
      )
    `)
    .eq('user_id', user.id)

  const memberships =
    (data ?? []).map((m) => ({
      orchestra_id: m.orchestra_id as string,
      orchestras: Array.isArray(m.orchestras)
        ? m.orchestras[0]
        : m.orchestras,
    })) ?? []

  let resolvedActiveOrchestraId = activeOrchestraId

  if (!resolvedActiveOrchestraId && memberships.length > 0) {
    resolvedActiveOrchestraId = memberships[0].orchestra_id
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div className="text-lg font-semibold">Cadenza</div>

      <nav className="flex items-center gap-6">
        <a href="/dashboard">Dashboard</a>
        <a href="/rehearsals">Rehearsals</a>
        <a href="/members">Members</a>

        {memberships && memberships.length > 0 && (
        <OrchestraSwitcher
            memberships={memberships}
            activeOrchestraId={resolvedActiveOrchestraId}
        />
        )}

        <UserMenu userName={displayName} />
      </nav>
    </header>
  )
}