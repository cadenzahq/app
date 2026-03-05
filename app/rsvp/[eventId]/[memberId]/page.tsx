import { createClient } from "@/lib/supabase/server";
import RSVPForm from "@/components/events/RSVPForm";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ eventId: string; memberId: string }>;
}) {

  const supabase = await createClient();
  
  const { eventId, memberId } = await params;

  // Get event info
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  // Get member info
  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("id", memberId)
    .single();

  // Get attendance record
  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("event_id", eventId)
    .eq("member_id", memberId)
    .maybeSingle();

  const currentStatus = attendance?.status || "No Response";

  // Get attendance summary
  const { data: allAttendance } = await supabase
    .from("attendance")
    .select("status")
    .eq("event_id", eventId);

  const summary = {
    attending: 0,
    maybe: 0,
    absent: 0,
    noResponse: 0
  };

  allAttendance?.forEach(record => {

    if (record.status === "Attending") summary.attending++;
    else if (record.status === "Maybe") summary.maybe++;
    else if (record.status === "Absent") summary.absent++;
    else summary.noResponse++;

  });

    return (

        <div style={pageBackgroundStyle}>

            <div style={containerStyle}>

                {/* Header */}

                <div style={headerContainerStyle}>

                    <h1 style={eventTitleStyle}>
                    {event.name}
                    </h1>

                    <div style={eventMetaStyle}>

                    <span>{formatDate(event.start_time)}</span>

                    <span style={separatorStyle}>•</span>

                    <span>{event.event_type}</span>

                    <span style={separatorStyle}>•</span>

                    <span>{event.location}</span>

                    </div>

                </div>


                {/* Member identity */}

                <div style={memberCardStyle}>

                    <div style={memberNameStyle}>
                    {member.first_name} {member.last_name}
                    </div>

                    <div style={memberInstrumentStyle}>
                    {member.instrument}
                    </div>

                </div>


                {/* RSVP Card */}

                <div style={rsvpCardStyle}>

                    <div style={cardTitleStyle}>
                    Your RSVP
                    </div>

                    <RSVPForm
                    eventId={eventId}
                    memberId={memberId}
                    initialStatus={currentStatus}
                    />

                </div>


                {/* Attendance Summary */}

                <div style={summaryCardStyle}>

                    <div style={summaryTitleStyle}>
                    Attendance
                    </div>

                    <div style={summaryRowStyle}>

                        <SummaryPill
                            label="Attending"
                            count={summary.attending}
                            color="#16a34a"
                            bg="#dcfce7"
                        />

                        <SummaryPill
                            label="Maybe"
                            count={summary.maybe}
                            color="#ca8a04"
                            bg="#fef9c3"
                        />

                        <SummaryPill
                            label="Absent"
                            count={summary.absent}
                            color="#dc2626"
                            bg="#fee2e2"
                        />

                    </div>

                </div>

            </div>

        </div>

    );
}

function formatDate(dateString: string) {

  const date = new Date(dateString);

  return date.toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });

}

function SummaryPill({
  label,
  count,
  color,
  bg
}: {
  label: string;
  count: number;
  color: string;
  bg: string;
}) {

  return (

    <div
      style={{
        padding: "8px 12px",
        borderRadius: "999px",
        backgroundColor: bg,
        color,
        fontSize: "14px",
        fontWeight: "500"
      }}
    >
      {count} {label}
    </div>

  );

}

const metaStyle = {
  color: "#666",
  marginBottom: "20px"
};

const memberStyle = {
  marginBottom: "20px",
  fontWeight: "500"
};

const summaryStyle = {
  marginTop: "20px",
  fontSize: "14px",
  color: "#666"
};

const pageBackgroundStyle = {
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  padding: "40px 20px"
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "white",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  padding: "32px"
};

const headerContainerStyle = {
  marginBottom: "28px"
};

const eventTitleStyle = {
  fontSize: "28px",
  fontWeight: "600",
  marginBottom: "6px"
};

const eventMetaStyle = {
  display: "flex",
  gap: "6px",
  color: "#6b7280",
  fontSize: "14px"
};

const separatorStyle = {
  color: "#9ca3af"
};

const memberCardStyle = {
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  marginBottom: "24px"
};

const memberNameStyle = {
  fontWeight: "600",
  fontSize: "16px"
};

const memberInstrumentStyle = {
  fontSize: "14px",
  color: "#6b7280"
};

const rsvpCardStyle = {
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  marginBottom: "20px"
};

const cardTitleStyle = {
  fontWeight: "600",
  marginBottom: "12px"
};

const summaryCardStyle = {
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb"
};

const summaryTitleStyle = {
  fontWeight: "600",
  marginBottom: "12px"
};

const summaryRowStyle = {
  display: "flex",
  gap: "8px"
};