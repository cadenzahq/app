"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ok, fail, type ActionResult } from "@/lib/actions";

export async function updateAttendance({
  eventId,
  orchestraId,
  memberId,
  status,
}: {
  eventId: string;
  orchestraId: string;
  memberId: string;
  status: string | null;
}): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // 🔷 Validate event
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("orchestra_id", orchestraId)
      .maybeSingle();

    if (eventError) {
      console.error("Event validation error:", eventError);
      return fail("Failed to validate event");
    }

    if (!event) {
      return fail("Invalid event");
    }

    // 🔷 Validate member
    const { data: member, error: memberError } = await supabase
      .from("members")
      .select("id")
      .eq("id", memberId)
      .eq("orchestra_id", orchestraId)
      .maybeSingle();

    if (memberError) {
      console.error("Member validation error:", memberError);
      return fail("Failed to validate member");
    }

    if (!member) {
      return fail("Invalid member");
    }

    // 🔷 Upsert attendance
    const { error } = await supabase
      .from("attendance")
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
      console.error("Attendance update error:", error);
      return fail("Failed to update attendance");
    }

    // 🔷 Revalidate page
    revalidatePath(`/app/${orchestraId}/admin/events/${eventId}`);

    return ok();
  } catch (err) {
    console.error("Attendance crash:", err);
    return fail("Unexpected error");
  }
}