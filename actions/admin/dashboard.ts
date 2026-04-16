"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { RSVP_STATUS } from "@/lib/constants";
import { sendRSVPEmail } from "@/lib/email";

export async function sendEventReminder(
  eventId: string
): Promise<{ success: boolean; count: number }> {
  const supabase = await createClient();

  // 1️⃣ Get active orchestra
  const orchestra = await getActiveOrchestraForUser(supabase);
  if (!orchestra) {
    return { success: false, count: 0 };
  }

  // 2️⃣ Get pending RSVP rows WITH full context
  const { data: rows, error } = await supabase
    .from("event_member_rsvp")
    .select("*")
    .eq("event_id", eventId)
    .eq("orchestra_id", orchestra.id)
    .eq("status", RSVP_STATUS.PENDING);

  if (error) {
    console.error("Reminder query error:", error);
    return { success: false, count: 0 };
  }

  if (!rows || rows.length === 0) {
    return { success: true, count: 0 };
  }

  // 3️⃣ Send emails
  const BATCH_SIZE = 5;
  const DELAY_MS = 1000;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows
      .slice(i, i + BATCH_SIZE)
      .filter((row) => row.is_active && row.email)

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

    // Wait between batches to respect rate limit
    if (i + BATCH_SIZE < rows.length) {
      await new Promise((res) => setTimeout(res, DELAY_MS));
    }
  }

  return { success: true, count: rows.length };
}