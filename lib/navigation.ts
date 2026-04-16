export type NavigationRole = "admin" | "member"

export type NavItem = {
  label: string
  href: string
}

export const navigation: Record<NavigationRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Events", href: "/admin/events" },
    { label: "Members", href: "/admin/members" },
    { label: "Announcements", href: "/admin/announcements" },
    { label: "Tasks", href: "/admin/tasks" },
  ],

  member: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Events", href: "/events" },
    { label: "RSVP", href: "/rsvp" },
  ],
}

export function getNavigation(role: NavigationRole | null) {
  if (!role) return []
  return navigation[role]
}