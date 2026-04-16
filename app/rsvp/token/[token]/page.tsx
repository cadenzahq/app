import { createClient } from "@/lib/supabase/server";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = await createClient();

  const { data: rsvp } = await supabase
    .from("event_member_rsvp")
    .select("*")
    .eq("token", token)
    .single();

  if (!rsvp) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Invalid RSVP link</h1>
      </div>
    );
  }

  function formatStatus(status: string) {
    switch (status) {
      case "yes":
        return "Attending";
      case "maybe":
        return "Maybe";
      case "no":
        return "Not Attending";
      default:
        return status;
    }
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h1 style={logoStyle}>CADENZA</h1>
          <p style={taglineStyle}>Orchestra Management System</p>
        </div>

        <div style={contentStyle}>
          <p>Hello {rsvp.first_name},</p>

          <div style={eventBoxStyle}>
            <p style={eventNameStyle}>{rsvp.event_name}</p>
            <p style={eventMetaStyle}>
              {new Date(rsvp.event_start_time).toLocaleString()}
            </p>
            <p style={eventMetaStyle}>{rsvp.event_location}</p>
          </div>

          {rsvp.responded_at ? (
            <div style={confirmationBoxStyle}>
              <p style={confirmationTitleStyle}>
                ✅ RSVP received
              </p>
              <p style={confirmationTextStyle}>
                You’re marked as{" "}
                <strong>{formatStatus(rsvp.status)}</strong>
              </p>
            </div>
          ) : (
            <div style={{ marginTop: 20 }}>
              <p>Please respond using the email links.</p>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          Sent via Cadenza Orchestra Management
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  backgroundColor: "#f4f4f7",
  minHeight: "100vh",
  padding: "40px 20px",
};

const cardStyle = {
  maxWidth: "500px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const headerStyle = {
  backgroundColor: "#111827",
  padding: "20px",
  textAlign: "center" as const,
};

const logoStyle = {
  color: "#ffffff",
  margin: 0,
  letterSpacing: "2px",
};

const taglineStyle = {
  color: "#9ca3af",
  fontSize: "12px",
  marginTop: "4px",
};

const contentStyle = {
  padding: "24px",
};

const eventBoxStyle = {
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

const eventNameStyle = {
  fontWeight: 600,
  marginBottom: "6px",
};

const eventMetaStyle = {
  fontSize: "14px",
  color: "#6b7280",
};

const confirmationBoxStyle = {
  marginTop: "24px",
  padding: "16px",
  backgroundColor: "#ecfdf5",
  borderRadius: "8px",
  border: "1px solid #bbf7d0",
};

const confirmationTitleStyle = {
  color: "#047857",
  fontWeight: 600,
  marginBottom: "6px",
};

const confirmationTextStyle = {
  color: "#065f46",
};

const footerStyle = {
  padding: "12px",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#6b7280",
  backgroundColor: "#f9fafb",
};