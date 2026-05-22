"use server";

import { createClient } from "@/lib/supabase/server";
import { ok, fail, type ActionResult } from "@/lib/actions";

export async function upsertRSVP(
  orchestraId: string,
  eventId: string,
  status: "yes" | "no" | "maybe"
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // 🔷 Get user (required)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return fail("Not authenticated");
    }

    // 🔷 Get member (authoritative)
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("id, orchestra_id")
      .eq("user_id", user.id)
      .eq("orchestra_id", orchestraId)
      .eq("is_active", true)
      .maybeSingle();

    if (memberError || !member) {
      console.error("Member lookup failed:", memberError);
      return fail("Member not found");
    }

    // 🔷 Upsert RSVP
    const { error } = await supabase
      .from("rsvps")
      .upsert(
        {
          event_id: eventId,
          member_id: member.id,
          orchestra_id: member.orchestra_id,
          status,
          responded_at: new Date().toISOString(),
        },
        {
          onConflict: "event_id,member_id",
        }
      );

    if (error) {
      console.error("RSVP upsert error:", error);
      return fail("Failed to update RSVP");
    }

    return ok();
  } catch (err) {

    return fail("Unexpected error");
  }
}
