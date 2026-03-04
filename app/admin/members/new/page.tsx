import { createClient } from "../../../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getActiveOrchestra } from '@/lib/orchestra'

export default async function MembersPage() {

  const supabase = await createClient();
  const activeOrchestraId = await getActiveOrchestra()

  if (!activeOrchestraId) {
    return <div style={containerStyle}>No orchestra selected.</div>;
  }

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("orchestra_id", activeOrchestraId)
    .eq("is_active", true)
    .order("last_name", { ascending: true });

  async function addMember(formData: FormData) {
    "use server";

    const supabase = await createClient();
    const activeOrchestraId = await getActiveOrchestra();

    if (!activeOrchestraId) return;

    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const instrument = formData.get("instrument") as string;
    const section = formData.get("section") as string;
    const emergency_contact_name = formData.get("emergency_contact_name") as string;
    const emergency_contact_phone = formData.get("emergency_contact_phone") as string;

    if (!first_name || !last_name) return;

    await supabase.from("members").insert({
      orchestra_id: activeOrchestraId,
      first_name,
      last_name,
      email,
      phone,
      instrument,
      section,
      emergency_contact_name,
      emergency_contact_phone,
      is_active: true
    });

    revalidatePath("/members");
  }

  return (
    <div style={containerStyle}>

      <h1 style={headingStyle}>Members</h1>

      {/* Add Member Form */}

      <form action={addMember} style={formStyle}>

        <h2>Add Member</h2>

        <div style={rowStyle}>
          <input name="first_name" placeholder="First name" style={inputStyle} required />
          <input name="last_name" placeholder="Last name" style={inputStyle} required />
        </div>

        <div style={rowStyle}>
          <input name="email" placeholder="Email" style={inputStyle} />
          <input name="phone" placeholder="Phone" style={inputStyle} />
        </div>

        <div style={rowStyle}>
          <input name="instrument" placeholder="Instrument" style={inputStyle} />
          <input name="section" placeholder="Section" style={inputStyle} />
        </div>

        <div style={rowStyle}>
          <input
            name="emergency_contact_name"
            placeholder="Emergency contact name"
            style={inputStyle}
          />
          <input
            name="emergency_contact_phone"
            placeholder="Emergency contact phone"
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Add Member
        </button>

      </form>

      {/* Members List */}

      <div style={listStyle}>

        <h2>Roster</h2>

        {!members || members.length === 0 ? (
          <p>No members yet.</p>
        ) : (
          <ul style={ulStyle}>
            {members.map(member => (
              <li key={member.id} style={memberStyle}>
                <strong>
                  {member.last_name}, {member.first_name}
                </strong>
                <br />
                {member.instrument} — {member.section}
                {member.email && (
                  <>
                    <br />
                    {member.email}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

      </div>

    </div>
  );
}

/* Styles */

const containerStyle = {
  padding: "32px",
  maxWidth: "800px",
  margin: "0 auto"
};

const headingStyle = {
  fontSize: "28px",
  marginBottom: "24px"
};

const formStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "32px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px"
};

const rowStyle = {
  display: "flex",
  gap: "12px"
};

const inputStyle = {
  flex: 1,
  padding: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px",
  backgroundColor: "#111",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const listStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px"
};

const ulStyle = {
  listStyle: "none",
  padding: 0
};

const memberStyle = {
  padding: "8px 0",
  borderBottom: "1px solid #eee"
};