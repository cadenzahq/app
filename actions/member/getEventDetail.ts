import { createClient } from "@/lib/supabase/server";

type MemberEventDetail = {
  id: string;
  name: string;
  start_time: string;
  location: string | null;
  description: string | null;
  my_rsvp_status: "yes" | "no" | "maybe" | "pending" | null;
};

export async function getEventDetail(
  eventId: string,
  orchestraId: string
): Promise<MemberEventDetail | null> {
  const supabase = await createClient();

  if (!eventId || !orchestraId) return null;

  const { data, error } = await supabase
    .from("member_event_detail_v")
    .select("*")
    .eq("id", eventId)
    .eq("orchestra_id", orchestraId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching event detail:", error);
    return null;
  }

  return data ?? null;
}