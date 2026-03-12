import { createClient } from "@/lib/supabase/server"
import type { DashboardData } from "@/lib/types"

export async function getDashboardData(
  orchestraId: string
): Promise<DashboardData> {

  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc("get_dashboard_data", { orchestra_id: orchestraId })
    .single()

  if (error) {
    throw new Error("Failed to load dashboard data")
  }

  return data as DashboardData
}