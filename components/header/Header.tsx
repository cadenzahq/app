import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { getUserContext } from '@/lib/user-context'
import { getNavigation } from '@/lib/navigation'
import HeaderUI from './HeaderUI'

export default async function Header() {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const context = await getUserContext()

  // Not logged in → no header (cleaner for login/reset pages)
  if (!context.user) {
    return null
  }

  // Navigation
  const navItems = getNavigation(context.navigationRole)

  // Memberships (for switcher)
  const { data } = await supabase
    .from('members')
    .select(`
      orchestra_id,
      orchestras (
        id,
        name
      )
    `)
    .eq('user_id', context.user.id)

  const memberships =
    (data ?? []).map((m) => ({
      orchestra_id: m.orchestra_id as string,
      orchestras: Array.isArray(m.orchestras)
        ? m.orchestras[0]
        : m.orchestras,
    })) ?? []

  const activeOrchestraId =
    cookieStore.get('active_orchestra_id')?.value

  // User display name (quick + safe fallback)
  const displayName =
    context.user.email ?? 'User'

  return (
    <HeaderUI
      navItems={navItems}
      userName={displayName}
      memberships={memberships}
      activeOrchestraId={activeOrchestraId}
    />
  )
}