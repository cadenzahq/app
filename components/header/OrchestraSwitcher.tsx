'use client'

import { useState, useRef, useEffect } from 'react'

type Membership = {
  orchestra_id: string
  orchestras: {
    id: string
    name: string
  } | null
}

export default function OrchestraSwitcher({
  memberships,
  activeOrchestraId,
}: {
  memberships: Membership[]
  activeOrchestraId?: string
}) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (id: string) => {
    document.cookie = `active_orchestra_id=${id}; path=/`
    window.location.reload()
  }

  const active = memberships.find(
    (m) => m.orchestra_id === activeOrchestraId
  )

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 text-sm font-medium text-ivory hover:text-gold transition"
      >
        {active?.orchestras?.name ?? 'Select Orchestra'}
        <span className="text-xs">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-navy border border-navy/40 py-2 z-50">

          {memberships.map((m) =>
            m.orchestras ? (
              <button
                key={m.orchestra_id}
                onClick={() => handleSelect(m.orchestra_id)}
                className={`block w-full text-left px-4 py-2 text-sm transition ${
                  m.orchestra_id === activeOrchestraId
                    ? 'bg-midnight text-gold'
                    : 'text-ivory hover:bg-midnight'
                }`}
              >
                {m.orchestras.name}
              </button>
            ) : null
          )}

        </div>
      )}
    </div>
  )
}