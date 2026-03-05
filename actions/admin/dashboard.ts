"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestra } from "@/lib/orchestra";
import { RSVP_STATUS } from "@/lib/constants";

export async function sendEventReminder(
  eventId: string
): Promise<{ success: boolean; count: number }> {
  const supabase = await createClient();

  // 1️⃣ Get active orchestra inside the server action
  const orchestra = await getActiveOrchestra();
  if (!orchestra) {
    return { success: false, count: 0 };
  }

  // 2️⃣ Fetch pending RSVPs scoped correctly
  const { data: rsvps, error } = await supabase
    .from("rsvps")
    .select("member_id")
    .eq("event_id", eventId)
    .eq("orchestra_id", orchestra.id)
    .eq("status", RSVP_STATUS.PENDING);

  if (error) {
    console.error("Reminder query error:", error);
    return { success: false, count: 0 };
  }

  if (!rsvps || rsvps.length === 0) {
    return { success: true, count: 0 };
  }

  // 3️⃣ (Your email sending logic goes here)

  return { success: true, count: rsvps.length };
}