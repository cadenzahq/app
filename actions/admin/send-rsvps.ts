"use server";

import { createClient } from "@/lib/supabase/server";

export type RSVPStatus = "yes" | "maybe" | "no" | "pending";

export async function updateRSVPStatusAction({
  eventId,
  memberId,
  status,
}: {
  eventId: string;
  memberId: string;
  status: RSVPStatus;
}) {
  const supabase = await createClient();

  // ✅ Upsert ensures record exists OR updates existing
  const { error } = await supabase
    .from("rsvps")
    .upsert(
      {
        event_id: eventId,
        member_id: memberId,
        status,
        responded_at: new Date().toISOString(),
      },
      {
        onConflict: "event_id,member_id",
      }
    );

  if (error) {
    console.error("RSVP update failed:", error);
    throw new Error(error.message);
  }
}