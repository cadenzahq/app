'use client'

import Link from 'next/link'
import type { NavItem } from '@/lib/navigation'
import OrchestraSwitcher from './OrchestraSwitcher'
import UserMenu from './UserMenu'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type Membership = {
  orchestra_id: string
  orchestras: {
    id: string
    name: string
  } | null
}

type Props = {
  navItems: NavItem[]
  userName: string
  memberships: Membership[]
  activeOrchestraId?: string
}

export default function HeaderUI({
  navItems,
  userName,
  memberships,
  activeOrchestraId,
}: Props) {
  const pathname = usePathname()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-navy/40 bg-midnight text-ivory">

      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-10">

        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/branding/Cadenza_2 Color Dark BG.svg"
            alt="Cadenza"
            width={140}
            height={40}
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors ${
                  isActive
                    ? 'text-gold'
                    : 'text-ivory hover:text-gold'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

      </div>

      {/* Right: Orchestra + User */}
      <div className="flex items-center gap-4">

        {memberships.length > 0 && (
          <OrchestraSwitcher
            memberships={memberships}
            activeOrchestraId={activeOrchestraId}
          />
        )}

        <UserMenu userName={userName} />

      </div>

    </header>
  )
}