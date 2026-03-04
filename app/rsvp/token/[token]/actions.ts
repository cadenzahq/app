"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitRSVP(token: string, formData: FormData) {
  const supabase = await createClient();

  const status = formData.get("status") as string;

  if (!status) {
    throw new Error("Missing status");
  }

  // Get RSVP record
  const { data: rsvp, error: rsvpError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("token", token)
    .single();

  if (rsvpError || !rsvp) {
    throw new Error("Invalid RSVP token");
  }

  // Update attendance
  const { error } = await supabase
    .from("attendance")
    .upsert(
      {
        event_id: rsvp.event_id,
        orchestra_id: rsvp.orchestra_id,
        member_id: rsvp.member_id,
        status,
      },
      {
        onConflict: "event_id,member_id",
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  // Mark RSVP as responded
  await supabase
    .from("rsvps")
    .update({
      responded_at: new Date().toISOString(),
    })
    .eq("token", token);

  return;
}