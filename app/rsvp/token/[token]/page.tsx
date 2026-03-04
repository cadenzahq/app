import { createClient } from "@/lib/supabase/server";
import { submitRSVP } from "./actions";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const supabase = await createClient();

  // Load RSVP record
  const { data: rsvp } = await supabase
    .from("rsvps")
    .select(`
      *,
      event:events(*),
      member:members(*)
    `)
    .eq("token", token)
    .single();

  if (!rsvp) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Invalid RSVP link</h1>
      </div>
    );
  }

  const action = submitRSVP.bind(null, token);

  return (
    <div style={containerStyle}>
      <h1>RSVP</h1>

      <p>
        Hello {rsvp.member.first_name},
      </p>

      <h2>{rsvp.event.name}</h2>

      <p>
        {new Date(rsvp.event.start_time).toLocaleString()}
      </p>

      <p>
        {rsvp.event.location}
      </p>

      <form action={action}>
        <select name="status" style={selectStyle}>
          <option value="Attending">Attending</option>
          <option value="Maybe">Maybe</option>
          <option value="Absent">Absent</option>
        </select>

        <br /><br />

        <button type="submit" style={buttonStyle}>
          Submit RSVP
        </button>
      </form>

      {rsvp.responded_at && (
        <p style={{ marginTop: 20, color: "green" }}>
          You have already responded.
        </p>
      )}
    </div>
  );
}

const containerStyle = {
  padding: "40px",
  maxWidth: "500px",
  margin: "0 auto",
};

const selectStyle = {
  padding: "8px",
  fontSize: "16px",
};

const buttonStyle = {
  padding: "10px 16px",
  fontSize: "16px",
  backgroundColor: "#333",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};