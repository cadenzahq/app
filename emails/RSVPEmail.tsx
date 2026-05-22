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
  const respondBase = rsvpUrl.replace("/token/", "/respond/");

  return (
    <CadenzaLayout preview={`RSVP requested for ${eventName}`}>

      <Text style={text}>
        Hello {memberName},
      </Text>

      <Text style={text}>
        You have been requested to RSVP for the following event:
      </Text>

      {/* Event Card */}
      <Section style={eventCard}>
        <Text style={eventNameText}>{eventName}</Text>
        <Text style={eventMeta}>{eventDate}</Text>
      </Section>

      {/* Quick RSVP */}
      <Section style={{ marginTop: "24px", textAlign: "center" }}>
        <Text style={label}>Quick RSVP:</Text>

        <table align="center" role="presentation" style={{ margin: "0 auto" }}>
          <tr>
            <td style={{ padding: "0 4px" }}>
              <Button href={`${respondBase}?status=yes`} style={yesBtn}>
                Yes
              </Button>
            </td>
            <td style={{ padding: "0 4px" }}>
              <Button href={`${respondBase}?status=maybe`} style={maybeBtn}>
                Maybe
              </Button>
            </td>
            <td style={{ padding: "0 4px" }}>
              <Button href={`${respondBase}?status=no`} style={noBtn}>
                No
              </Button>
            </td>
          </tr>
        </table>
      </Section>

      {/* Full Page */}
      <Section style={center}>
        <Button href={rsvpUrl} style={primaryBtn}>
          View RSVP Details
        </Button>
      </Section>

      <Text style={footer}>
        Please respond as soon as possible.
      </Text>

    </CadenzaLayout>
  );
}

const text: React.CSSProperties = {
  marginBottom: "12px",
  color: "#0F172A",
};

const eventCard: React.CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
};

const eventNameText: React.CSSProperties = {
  fontWeight: "600",
  fontSize: "16px",
  marginBottom: "4px",
};

const eventMeta: React.CSSProperties = {
  fontSize: "14px",
  color: "#64748b",
};

const center: React.CSSProperties = {
  marginTop: "24px",
  textAlign: "center",
};

const label: React.CSSProperties = {
  marginBottom: "10px",
  fontSize: "14px",
};

const buttonRow: React.CSSProperties = {
  textAlign: "center",
};

const primaryBtn: React.CSSProperties = {
  backgroundColor: "#0F172A",
  color: "#ffffff",
  padding: "12px 20px",
  borderRadius: "6px",
  textDecoration: "none",
};

const yesBtn: React.CSSProperties = {
  backgroundColor: "#16a34a",
  color: "#ffffff",
  padding: "10px 14px",
  borderRadius: "6px",
  textDecoration: "none",
};

const maybeBtn: React.CSSProperties = {
  backgroundColor: "#D4A44D",
  color: "#0F172A",
  padding: "10px 14px",
  borderRadius: "6px",
  textDecoration: "none",
};

const noBtn: React.CSSProperties = {
  backgroundColor: "#dc2626",
  color: "#ffffff",
  padding: "10px 14px",
  borderRadius: "6px",
  textDecoration: "none",
};

const footer: React.CSSProperties = {
  marginTop: "30px",
  fontSize: "14px",
};