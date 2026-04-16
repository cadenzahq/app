import { createClient } from "@/lib/supabase/server";
import RSVPForm from "@/components/events/RSVPForm";

export default async function RSVPPage({
  params,
}: {
  params: Promise<{ eventId: string; memberId: string }>;
}) {
  const { eventId, memberId } = await params;
  const supabase = await createClient();

  // ✅ Event
  const { data: event } = await supabase
    .from("events")
    .select("id, name, start_time, location")
    .eq("id", eventId)
    .single();

  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  // ✅ Member
  const { data: member } = await supabase
    .from("members")
    .select("id, display_name")
    .eq("id", memberId)
    .single();

  if (!member) {
    return <div className="p-6">Member not found</div>;
  }

  // ✅ RSVP (canonical source)
  const { data: rsvp } = await supabase
    .from("rsvps")
    .select("status")
    .eq("event_id", eventId)
    .eq("member_id", memberId)
    .maybeSingle();

  const currentStatus = rsvp?.status ?? "pending";

  // ✅ RSVP Counts (from DB, NOT UI)
  const { data: counts } = await supabase
    .from("rsvp_counts_v")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  const summary = counts ?? {
    yes: 0,
    maybe: 0,
    no: 0,
    pending: 0,
  };

  return (
    <div className="bg-ivory min-h-screen px-4 py-8">
      <div className="max-w-xl mx-auto bg-white border border-navy/20 rounded-xl p-6 space-y-6">

        {/* Event */}
        <div>
          <h1 className="text-2xl font-semibold text-midnight">
            {event.name}
          </h1>
          <p className="text-sm text-navy">
            {new Date(event.start_time).toLocaleString()}
          </p>
          {event.location && (
            <p className="text-sm text-navy">{event.location}</p>
          )}
        </div>

        {/* Member */}
        <div className="bg-ivory border border-navy/20 rounded-lg p-4">
          <p className="text-sm text-navy">Responding as</p>
          <p className="font-medium text-midnight">
            {member.display_name}
          </p>
        </div>

        {/* RSVP */}
        <div>
          <h2 className="text-sm font-medium text-navy mb-2">
            Your RSVP
          </h2>

          <RSVPForm
            eventId={eventId}
            memberId={memberId}
            initialStatus={currentStatus}
          />
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-sm font-medium text-navy mb-2">
            Current Responses
          </h2>

          <div className="flex gap-2 flex-wrap">
            <SummaryPill label="Attending" count={summary.yes} color="green" />
            <SummaryPill label="Maybe" count={summary.maybe} color="yellow" />
            <SummaryPill label="Not Attending" count={summary.no} color="red" />
            <SummaryPill label="Pending" count={summary.pending} color="gray" />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------- UI Helpers ---------- */

function SummaryPill({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "green" | "yellow" | "red" | "gray";
}) {
  const styles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };

  return (
    <div className={`px-3 py-1 rounded-full text-sm ${styles[color]}`}>
      {count} {label}
    </div>
  );
}