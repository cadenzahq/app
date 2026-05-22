import { createClient } from "@/lib/supabase/server";

type MemberAttendance = {
  event_id: string;
  event_name: string;
  event_start_time: string;
  attendance_status:
    | "present"
    | "absent"
    | "late"
    | "excused"
    | "unmarked";
};

export async function getAttendance(
  orchestraId: string
): Promise<MemberAttendance[]> {
  const supabase = await createClient();

  if (!orchestraId) return [];

  const { data, error } = await supabase
    .from("member_attendance_v")
    .select("*")
    .eq("orchestra_id", orchestraId)
    .eq("is_past_event", true)
    .order("event_start_time", { ascending: false });

  if (error) {
    // ✅ Silent fail in production
    if (process.env.NODE_ENV === "development") {
      console.error("getAttendance error:", error);
    }

    return [];
  }

  return data ?? [];
}