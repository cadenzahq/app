"use server";

import { createClient } from "@/lib/supabase/server";
import { sendRSVPEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

/**
 * Creates an RSVP invite and sends email to member
 */
export async function createRSVPInvite(
  eventId: string,
  orchestraId: string,
  memberId: string
) {
  const supabase = await createClient();

  // 1. Get member info
  const { data: member, error: memberError } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .single();

  if (memberError || !member) {
    throw new Error("Member not found");
  }

  // 2. Get event info
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    throw new Error("Event not found");
  }

  // 3. Check for existing RSVP
  const { data: existingRSVP } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .eq("member_id", memberId)
    .single();

  let token: string;

  if (existingRSVP) {
    // Reuse existing token
    token = existingRSVP.token;
  } else {
    // Create new token
    token = crypto.randomUUID();

    const { error: insertError } = await supabase
      .from("rsvps")
      .insert({
        event_id: eventId,
        orchestra_id: orchestraId,
        member_id: memberId,
        token,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  // 4. Build RSVP URL
  const rsvpUrl =
    `${process.env.NEXT_PUBLIC_APP_URL}/rsvps/${token}`;

  // 5. Send email
  await sendRSVPEmail({
    to: member.email,
    memberName: member.first_name,
    eventName: event.name,
    eventDate: new Date(event.start_time).toLocaleString(),
    rsvpUrl,
  });

  // 6. Refresh event page
  revalidatePath(`/events/${eventId}`);
}

/**
 * Updates RSVP status (Accept / Decline)
 */
export async function updateAttendanceAction(
  eventId: string,
  orchestraId: string,
  formData: FormData
) {
  const supabase = await createClient();
  
  const memberId = formData.get("memberId") as string;
  const status = formData.get("status") as string;

  if (!eventId || !orchestraId || !memberId || !status) {
    throw new Error("Missing required fields");
  }

  const { error } = await supabase
    .from("attendance")
    .upsert(
      {
        event_id: eventId,
        member_id: memberId,
        orchestra_id: orchestraId,
        status,
      },
      {
        onConflict: "event_id,member_id",
      }
    );

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath(`/events/${eventId}`);

}