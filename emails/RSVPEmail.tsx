import {
  Button,
  Section,
  Text,
} from "@react-email/components";

import CadenzaLayout from "./components/CadenzaLayout";

export default function RSVPEmail({
  memberName,
  eventName,
  eventDate,
  rsvpUrl,
}: {
  memberName: string;
  eventName: string;
  eventDate: string;
  rsvpUrl: string;
}) {
  return (
    <CadenzaLayout preview={`RSVP requested for ${eventName}`}>
      
      <Text>Hello {memberName},</Text>

      <Text>
        You have been requested to RSVP for the following event:
      </Text>

      <Section style={{ marginTop: "20px" }}>
        <Text><strong>{eventName}</strong></Text>
        <Text>{eventDate}</Text>
      </Section>

      <Section style={{ marginTop: "30px", textAlign: "center" }}>
        <Button
          href={rsvpUrl}
          style={{
            backgroundColor: "#111827",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          View RSVP
        </Button>
      </Section>

      <Text style={{ marginTop: "30px" }}>
        Please respond as soon as possible.
      </Text>

    </CadenzaLayout>
  );
}