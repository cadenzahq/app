import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export type UserContext = {
  user: any | null
  orchestra: {
    id: string
    name: string
  } | null
  role: string | null
  navigationRole: "admin" | "member" | null
}

export async function getUserContext(): Promise<UserContext> {
  const supabase = await createClient()
  const cookieStore = await cookies()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      user: null,
      orchestra: null,
      role: null,
      navigationRole: null,
    }
  }

  // 1️⃣ Get memberships
  const { data: memberships } = await supabase
    .from("members")
    .select(`
      orchestra_id,
      role,
      orchestras (
        id,
        name
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", true)

  if (!memberships || memberships.length === 0) {
    return {
      user,
      orchestra: null,
      role: null,
      navigationRole: null,
    }
  }

  // 2️⃣ Resolve active orchestra
  const activeOrchestraId =
    cookieStore.get("active_orchestra_id")?.value

  const selectedMembership =
    memberships.find(m => m.orchestra_id === activeOrchestraId)
    ?? memberships[0]

  const orchestra = Array.isArray(selectedMembership.orchestras)
    ? selectedMembership.orchestras[0]
    : selectedMembership.orchestras

  const role = selectedMembership.role

  // 3️⃣ Resolve navigation role
  const navigationRole =
    role === "member" ? "member" : "admin"

  return {
    user,
    orchestra,
    role,
    navigationRole,
  }
}