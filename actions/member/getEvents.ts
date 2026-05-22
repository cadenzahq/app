"use server";

import { createClient } from "@/lib/supabase/server";

type MemberEvent = {
  id: string;
  name: string;
  start_time: string;
  location: string | null;
  my_rsvp_status: "yes" | "no" | "maybe" | "pending" | null;
};

export async function getEvents(orchestraId: string): Promise<MemberEvent[]> {
  const supabase = await createClient();

  if (!orchestraId) return [];

  const { data, error } = await supabase
    .from("member_events_v")
    .select("*")
    .eq("orchestra_id", orchestraId)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching member events:", error);
    return [];
  }

  // ✅ NORMALIZE SHAPE HERE (CRITICAL)
  return (data ?? []).map((event) => ({
    id: event.event_id, // ← FIX
    name: event.name,
    start_time: event.start_time,
    location: event.location,
    my_rsvp_status: event.my_rsvp_status,
  }));
}