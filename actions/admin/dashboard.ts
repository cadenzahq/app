"use server";

import { createClient } from "@/lib/supabase/server";
import { getRequestContext } from "@/lib/server/getRequestContext";
import { RSVP_STATUS } from "@/lib/constants";
import { sendRSVPEmail } from "@/lib/email";

export async function sendEventReminder(
  eventId: string
): Promise<{ success: boolean; count: number }> {
  const supabase = await createClient();

  // 🔷 1. Get active orchestra
  const { activeOrchestraId } = await getRequestContext();

  if (!activeOrchestraId) {
    return { success: false, count: 0 };
  }

  // 🔷 2. Validate event belongs to this orchestra
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("orchestra_id", activeOrchestraId)
    .maybeSingle();

  if (eventError) {
    console.error("Event validation error:", eventError);
    return { success: false, count: 0 };
  }

  if (!event) {
    return { success: false, count: 0 };
  }

  // 🔷 3. Fetch pending RSVPs
  const { data: rows, error } = await supabase
    .from("event_member_rsvp")
    .select("*")
    .eq("event_id", eventId)
    .eq("orchestra_id", activeOrchestraId)
    .eq("status", RSVP_STATUS.PENDING);

  if (error) {
    console.error("Reminder query error:", error);
    return { success: false, count: 0 };
  }

  if (!rows || rows.length === 0) {
    return { success: true, count: 0 };
  }

  // 🔷 4. Send emails (batched)
  const BATCH_SIZE = 5;
  const DELAY_MS = 1000;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows
      .slice(i, i + BATCH_SIZE)
      .filter((row) => row.is_active && row.email);

    await Promise.all(
      batch.map(async (row) => {
        let token = row.token;

        if (!token) {
          token = crypto.randomUUID();

          const { error } = await supabase
            .from("rsvps")
            .update({ token })
            .eq("id", row.rsvp_id);

          if (error) {
            console.error("Token update failed:", error);
            return;
          }
        }

        return sendRSVPEmail({
          to: row.email,
          memberName: row.full_name,
          eventName: row.event_name,
          eventDate: new Date(row.event_start_time).toLocaleString(),
          rsvpUrl: `${process.env.NEXT_PUBLIC_APP_URL}/rsvp/token/${token}`,
        });
      })
    );

    if (i + BATCH_SIZE < rows.length) {
      await new Promise((res) => setTimeout(res, DELAY_MS));
    }
  }

  return { success: true, count: rows.length };
}