'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface UserMenuProps {
  userName: string
}

export default function UserMenu({ userName }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium hover:text-indigo-600 transition"
      >
        {userName}
        <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl shadow-lg bg-white border border-gray-200 py-2">
          <Link
            href="/profile"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}