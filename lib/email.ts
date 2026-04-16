import { Resend } from "resend";
import RSVPEmail from "@/emails/RSVPEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRSVPEmail({
  to,
  memberName,
  eventName,
  eventDate,
  rsvpUrl,
}: {
  to: string;
  memberName: string;
  eventName: string;
  eventDate: string;
  rsvpUrl: string;
}) {
  const { error } = await resend.emails.send({
    from: "Cadenza <noreply@cadenzahq.com>",
    to,
    subject: `RSVP Requested: ${eventName}`,
    react: RSVPEmail({
      memberName,
      eventName,
      eventDate,
      rsvpUrl,
    }),
    
  });
console.log("Sending email to:", to);
  if (error) {
    console.error("Resend error:", error);
    throw new Error("Failed to send RSVP email");
  }
}