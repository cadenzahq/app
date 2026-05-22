"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestContext } from "@/lib/server/getRequestContext";
import { ok, fail, type ActionResult } from "@/lib/actions";

export type RSVPStatus = "yes" | "maybe" | "no" | "pending";

export async function updateRSVPStatusAction({
  eventId,
  memberId,
  status,
}: {
  eventId: string;
  memberId: string;
  status: RSVPStatus;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const { activeOrchestraId } = await getRequestContext();

    if (!activeOrchestraId) {
      return fail("No active orchestra selected");
    }

    // 🔷 Validate event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("orchestra_id", activeOrchestraId)
      .maybeSingle();

    if (eventError || !event) {
      console.error("Event validation error:", eventError);
      return fail("Invalid event");
    }

    // 🔷 Validate member
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("id")
      .eq("id", memberId)
      .eq("orchestra_id", activeOrchestraId)
      .maybeSingle();

    if (memberError || !member) {
      console.error("Member validation error:", memberError);
      return fail("Invalid member");
    }

    // 🔷 Upsert
    const { error } = await supabase
      .from("rsvps")
      .upsert(
        {
          event_id: eventId,
          member_id: memberId,
          orchestra_id: activeOrchestraId,
          status,
          responded_at: new Date().toISOString(),
        },
        {
          onConflict: "event_id,member_id",
        }
      );

    if (error) {
      console.error("RSVP update failed:", error);
      return fail("Failed to update RSVP");
    }

    return ok();

  } catch (err) {
    console.error("RSVP action crash:", err);
    return fail("Unexpected error");
  }
}