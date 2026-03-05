"use server";

import { createClient } from "@/lib/supabase/server";

const orchestraId = "PASTE-YOUR-ORCHESTRA-ID-HERE";
const supabase = await createClient();

export async function updateAttendanceAction(
  eventId: string,
  formData: FormData
) {

  const memberId = formData.get("member_id") as string;
  const status = formData.get("status") as string;

  console.log("Updating:", eventId, memberId, status);

  const { data: existing } = await supabase
    .from("attendance")
    .select("id")
    .eq("event_id", eventId)
    .eq("member_id", memberId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("attendance")
      .update({
        status,
        responded_at: new Date().toISOString()
      })
      .eq("id", existing.id);

  } else {
    await supabase
      .from("attendance")
      .insert({
        orchestra_id: orchestraId,
        event_id: eventId,
        member_id: memberId,
        status,
        responded_at: new Date().toISOString()
      });
  }
}