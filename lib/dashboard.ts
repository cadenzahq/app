import { createClient } from "@/lib/supabase/server";
import type { DashboardData } from "@/lib/types";

export async function getDashboardData(
  orchestraId: string
): Promise<DashboardData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc("get_dashboard_data", { p_orchestra_id: orchestraId })
    .single<DashboardData>();

  if (error || !data) {
    console.error("Dashboard RPC error:", error);

    // Still keep a safe fallback (good practice)
    return {
      next_event: null,
      rsvp_counts: {
        yes: 0,
        maybe: 0,
        no: 0,
        pending: 0,
      },
      announcements: [],
      tasks: [],
      summary: {
        attendance_rate: 0,
        active_members: 0,
      },
    };
  }

  return data; // ✅ NO TRANSFORMATION
}