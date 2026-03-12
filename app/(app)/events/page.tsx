import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import LocalDateTime from "@/components/ui/LocalDateTime";
import Link from "next/link";
import { getActiveOrchestraForUser } from '@/lib/orchestra'

async function addEvent(formData: FormData) {
  "use server";
  
  const supabase = await createClient()
  const activeOrchestraId = await getActiveOrchestraForUser(supabase)

  if (!activeOrchestraId) return;

  const name = formData.get("name") as string;
  const event_type = formData.get("event_type") as string;
  const location = formData.get("location") as string;
  const start_time = formData.get("start_time") as string;
  const end_time = formData.get("end_time") as string;

  if (!name) return;

  await supabase.from("events").insert({
    name,
    event_type,
    location,
    start_time: start_time ? new Date(start_time).toISOString() : null,
    end_time: end_time ? new Date(end_time).toISOString() : null,
    orchestra_id: activeOrchestraId
  });

  revalidatePath("/events");
}

export default async function EventsPage() {

  const supabase = await createClient();
  const activeOrchestraId = await getActiveOrchestraForUser(supabase)

  if (!activeOrchestraId) {
    return <div>No orchestra selected.</div>
  }

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("orchestra_id", activeOrchestraId)
    .order("start_time", { ascending: true });

  return (
    <main style={{
      padding: "40px",
      maxWidth: "700px",
      margin: "0 auto",
      fontFamily: "Inter, sans-serif"
    }}>

      <h1 style={{
        fontSize: "32px",
        marginBottom: "24px"
      }}>
        Events
      </h1>

      {/* Event list */}

      <ul style={{
        marginBottom: "32px"
      }}>
        {events?.map((event) => (
            <li key={event.id}>
                <Link href={`/events/${event.id}`}>
                    <strong>{event.name}</strong>
                </Link>
                <br />
                {event.event_type} — {event.location}
                <br />
                {event.start_time ? (
                    <LocalDateTime isoString={event.start_time} />
                ) : (
                    "No time set"
                )}
            </li>
        ))}
      </ul>

      {/* Add event form */}

      <form action={addEvent} style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>

        <label style={labelStyle}>
            Event name
            <input
            name="name"
            placeholder="Event name"
            style={inputStyle}
        />
        </label>

        <label style={labelStyle}>
            Event type
            <select name="event_type" style={inputStyle} defaultValue="Rehearsal">
                <option value="Rehearsal">Rehearsal</option>
                <option value="Performance">Performance</option>
                <option value="Sectional">Sectional</option>
                <option value="Audition">Audition</option>
                <option value="Meeting">Meeting</option>
                <option value="Other">Other</option>
            </select>
        </label>

        <label style={labelStyle}>
            Location
            <input
            name="location"
            placeholder="Location"
            style={inputStyle}
            />
        </label>

        <label style={labelStyle}>
            Start time
            <input
            type="datetime-local"
            name="start_time"
            style={inputStyle}
        />
        </label>

        <label style={labelStyle}>
        End time
        <input
            type="datetime-local"
            name="end_time"
            style={inputStyle}
        />
        </label>

        <button style={buttonStyle}>
          Add Event
        </button>

      </form>

    </main>
  );
}

const inputStyle = {
  padding: "10px 12px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  padding: "10px 16px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#111",
  color: "white",
  cursor: "pointer",
  width: "150px"
};

const labelStyle = {
  display: "flex",
  flexDirection: "column" as const,
  fontSize: "14px",
  color: "#444",
  gap: "4px"
};