import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestra } from '@/lib/orchestra'
import AttendanceRow from "@/components/admin/AttendanceRow";
import { revalidatePath } from "next/cache";
import Popup from "@/components/ui/Popup";
import { redirect } from "next/navigation";
import {
  updateAttendanceAction,
  createRSVPInvite,
} from "@/app/actions/send-rsvp";

export default async function EventDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ invitesSent?: string }>;
}) {
  const { eventId } = await params;

  const supabase = await createClient();
  const activeOrchestraId = await getActiveOrchestra()

  if (!activeOrchestraId) redirect('/dashboard')

  // Get event
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq('orchestra_id', activeOrchestraId)
    .single();

  if (!event) {
    return <div style={containerStyle}>Event not found</div>;
  }

  const orchestraId = event.orchestra_id;

  // Get members
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("orchestra_id", orchestraId)
    .eq("is_active", true)
    .order("last_name");

  // Get attendance
  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("event_id", eventId)
    .eq("orchestra_id", activeOrchestraId);

  const attendanceMap = new Map(
    attendance?.map((a) => [a.member_id, a]) || []
  );

  // Check if RSVPs exist for this event
  const { count: rsvpCount } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventId);

  const invitesSentFlag = (rsvpCount ?? 0) > 0;
    
  // Server Action: Send RSVP Invites
  async function sendInvites() {
    "use server";

    const supabase = await createClient();
    const activeOrchestraId = await getActiveOrchestra()
    if (!activeOrchestraId) return

    const { data: members } = await supabase
      .from("members")
      .select("id")
      .eq("orchestra_id", activeOrchestraId)
      .eq("is_active", true);

    if (!members) return;

    for (const member of members) {
      await createRSVPInvite(eventId, orchestraId, member.id);
    }

    revalidatePath(`/events/${eventId}`);
    redirect(`/events/${eventId}?invitesSent=true`);    
  }

  // Bind attendance updater
  const updateAttendance = updateAttendanceAction.bind(
    null,
    eventId,
    orchestraId
  );

  // Attendance summary counts
  let attendingCount = 0;
  let maybeCount = 0;
  let absentCount = 0;
  let noResponseCount = 0;

  members?.forEach((member) => {
    const record = attendanceMap.get(member.id);

    if (!record || record.status === "No Response") noResponseCount++;
    else if (record.status === "Attending") attendingCount++;
    else if (record.status === "Maybe") maybeCount++;
    else if (record.status === "Absent") absentCount++;
  });

  const totalCount = members?.length || 0;

  // Instrument stats
  const instrumentStats = new Map<
    string,
    {
      total: number;
      attending: number;
      maybe: number;
      absent: number;
      noResponse: number;
    }
  >();

  members?.forEach((member) => {
    const instrument = member.instrument || "Unknown";

    if (!instrumentStats.has(instrument)) {
      instrumentStats.set(instrument, {
        total: 0,
        attending: 0,
        maybe: 0,
        absent: 0,
        noResponse: 0,
      });
    }

    const stats = instrumentStats.get(instrument)!;
    stats.total++;

    const record = attendanceMap.get(member.id);

    if (!record || record.status === "No Response") stats.noResponse++;
    else if (record.status === "Attending") stats.attending++;
    else if (record.status === "Maybe") stats.maybe++;
    else if (record.status === "Absent") stats.absent++;
  });

  // Generate warnings
  const instrumentWarnings: string[] = [];

  instrumentStats.forEach((stats, instrument) => {
    if (stats.attending === 0)
      instrumentWarnings.push(`No ${instrument} attending`);
    else if (stats.attending === 1 && stats.total > 1)
      instrumentWarnings.push(`Only 1 ${instrument} attending`);
    else if (stats.noResponse >= stats.total / 2 && stats.total >= 3)
      instrumentWarnings.push(
        `${stats.noResponse} ${instrument} have not responded`
      );
  });

  // Helpers
  function formatDate(dateString: string) {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function SummaryItem({
    label,
    count,
    color,
    bg,
  }: {
    label: string;
    count: number;
    color: string;
    bg: string;
  }) {
    return (
      <div
        style={{
          ...summaryItemStyle,
          backgroundColor: bg,
          border: `1px solid ${bg}`,
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color,
          }}
        >
          {count}
        </div>

        <div style={summaryLabelStyle}>{label}</div>
      </div>
    );
  }

  // Render
  return (
    <div style={containerStyle}>

      {invitesSentFlag && (
        <Popup
          type="success"
          message="RSVP invitations sent successfully"
        />
      )}

      <h1 style={eventTitleStyle}>{event.name}</h1>

      <div style={eventMetaStyle}>
        <span>{formatDate(event.start_time)}</span>
        <span>•</span>
        <span>{event.event_type}</span>
        <span>•</span>
        <span>{event.location}</span>
      </div>

      {invitesSentFlag && (
        <div style={sentLabelStyle}>
          RSVP invitations have been sent for this event
        </div>
      )}

      <form action={sendInvites}>
        <button
          type="submit"
          style={{
            ...inviteButtonStyle,
            backgroundColor: invitesSentFlag
              ? "#f59e0b"
              : "#2563eb",
          }}
        >
          {invitesSentFlag
            ? "Resend RSVP Invites"
            : "Send RSVP Invites"}
        </button>
      </form>

      {instrumentWarnings.length > 0 && (
        <div style={warningContainerStyle}>
          {instrumentWarnings.map((warning, index) => (
            <div key={index} style={warningStyle}>
              ⚠ {warning}
            </div>
          ))}
        </div>
      )}

      <h2>Attendance</h2>

      <div style={summaryBarStyle}>
        <SummaryItem
          label="Attending"
          count={attendingCount}
          color="#16a34a"
          bg="#dcfce7"
        />
        <SummaryItem
          label="Maybe"
          count={maybeCount}
          color="#ca8a04"
          bg="#fef9c3"
        />
        <SummaryItem
          label="Absent"
          count={absentCount}
          color="#dc2626"
          bg="#fee2e2"
        />
        <SummaryItem
          label="No Response"
          count={noResponseCount}
          color="#6b7280"
          bg="#f3f4f6"
        />
        <SummaryItem
          label="Total"
          count={totalCount}
          color="#111827"
          bg="#e5e7eb"
        />
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Member</th>
            <th style={thStyle}>Instrument</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {members?.map((member) => {
            const record = attendanceMap.get(member.id);
            const status = record?.status || "No Response";

            return (
              <AttendanceRow
                key={member.id}
                memberId={member.id}
                initialStatus={status}
                memberName={`${member.last_name}, ${member.first_name}`}
                instrument={member.instrument}
                action={updateAttendance}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* Styles */

const containerStyle = {
  padding: "32px",
  maxWidth: "900px",
  margin: "0 auto",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const thStyle = {
  textAlign: "left" as const,
  borderBottom: "1px solid #ddd",
  padding: "8px",
};

const summaryBarStyle = {
  display: "flex",
  gap: "12px",
  marginBottom: "20px",
};

const summaryItemStyle = {
  padding: "10px 14px",
  borderRadius: "8px",
  minWidth: "90px",
  textAlign: "center" as const,
};

const summaryLabelStyle = {
  fontSize: "12px",
  marginTop: "2px",
};

const eventTitleStyle = {
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "4px",
};

const eventMetaStyle = {
  display: "flex",
  gap: "8px",
  color: "#6b7280",
  fontSize: "14px",
  marginBottom: "20px",
};

const warningContainerStyle = {
  marginBottom: "16px",
};

const warningStyle = {
  padding: "8px 12px",
  backgroundColor: "#fff7ed",
  border: "1px solid #fed7aa",
  borderRadius: "6px",
  color: "#9a3412",
  fontSize: "14px",
  marginBottom: "6px",
};

const inviteButtonStyle = {
  padding: "8px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginBottom: "16px",
};

const successBannerStyle = {
  padding: "10px 14px",
  backgroundColor: "#dcfce7",
  border: "1px solid #16a34a",
  color: "#166534",
  borderRadius: "6px",
  marginBottom: "16px",
};

const popupStyle = {
  position: "fixed" as const,
  top: "20px",
  right: "20px",
  backgroundColor: "#16a34a",
  color: "white",
  padding: "12px 18px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 1000,
};

const sentLabelStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "8px 12px",
  borderRadius: "6px",
  marginBottom: "16px",
  fontSize: "14px",
};