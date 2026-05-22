import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import EventHeader from "./components/EventHeader";
import AttendanceTable from "./components/AttendanceTable";
import SeriesEvents from "./components/SeriesEvents";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";

import { updateAttendance } from "./actions";

type AttendanceMember = {
  member_id: string;
  full_name: string;
  instrument: string | null;
  instrument_sort_order: number;
  section: string;
  section_sort_order: number;
  attendance_status: string;
};

export default async function EventPage({
  params,
}: {
  params: Promise<{
    orchestraId: string;
    eventId: string;
  }>;
}) {
  const { orchestraId, eventId } = await params;

  if (!orchestraId || !eventId) {
    redirect("/login");
  }

  const supabase = await createClient();

  /* --------------------------
     Event
  --------------------------- */

  const { data: event, error } = await supabase
    .from("event_detail")
    .select("*")
    .eq("id", eventId)
    .eq("orchestra_id", orchestraId)
    .maybeSingle();

  if (error) {
    console.error("Event fetch error:", error);

    redirect(`/app/${orchestraId}/admin/events`);
  }

  if (!event) {
    redirect(`/app/${orchestraId}/admin/events`);
  }

  const isLocked = event.is_attendance_locked;

  const series = {
    id: event.series_id,
    name: event.series_name,
  };

  const season = {
    id: event.season_id,
    name: event.season_name,
  };

  /* --------------------------
     Attendance
  --------------------------- */

  const {
    data: members,
    error: membersError,
  } = await supabase
    .from("event_member_attendance")
    .select("*")
    .eq("orchestra_id", orchestraId)
    .eq("event_id", eventId);

  if (membersError) {
    console.error(
      "Attendance fetch error:",
      membersError
    );

    redirect(`/app/${orchestraId}/admin/events`);
  }

  const safeMembers = members ?? [];

  /* --------------------------
     Summary
  --------------------------- */

  const summary = safeMembers.reduce(
    (acc, member) => {
      const status = member.attendance_status;

      acc.total += 1;

      if (status === "present") acc.present += 1;
      else if (status === "late") acc.late += 1;
      else if (status === "absent") acc.absent += 1;
      else if (status === "excused") acc.excused += 1;
      else acc.no_response += 1;

      return acc;
    },
    {
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
      excused: 0,
      no_response: 0,
    }
  );

  /* --------------------------
     Grouping
  --------------------------- */

  const grouped =
    safeMembers.reduce<
      Record<string, AttendanceMember[]>
    >((acc, member) => {
      const section = member.section;

      if (!acc[section]) {
        acc[section] = [];
      }

      acc[section].push(member);

      return acc;
    }, {});

  Object.values(grouped).forEach(
    (sectionMembers) => {
      sectionMembers.sort(
        (a, b) =>
          a.instrument_sort_order -
          b.instrument_sort_order
      );
    }
  );

  const sortedSections =
    Object.entries(grouped).sort(
      (a, b) =>
        a[1][0].section_sort_order -
        b[1][0].section_sort_order
    );

  /* --------------------------
     Series Events
  --------------------------- */

  const { data: seriesEvents } =
    await supabase
      .from("events")
      .select("id,name,start_time")
      .eq("series_id", event.series_id)
      .eq("orchestra_id", orchestraId)
      .order("start_time");

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-semibold text-midnight">
          Event Details
        </h1>

        <Link
          href={`/app/${orchestraId}/admin/dashboard`}
          className="text-sm text-navy hover:underline"
        >
          ← Back to Dashboard
        </Link>

      </div>

      {/* Main Content */}
      <div className="grid grid-cols-[1fr_1fr] gap-10">

        {/* LEFT COLUMN */}
        <div className="space-y-8">

          <EventHeader
            event={event}
            series={series}
            season={season}
            isLocked={isLocked}
          />

          <SeriesEvents
            events={seriesEvents ?? []}
            currentEventId={eventId}
          />

          <div id="attendance">

            <h2 className="text-xl font-semibold mb-2">
              Attendance
            </h2>

            <div className="flex gap-4 text-sm mb-4">

              <span className="text-green-700 font-medium">
                Present: {summary.present}
              </span>

              <span className="text-yellow-700 font-medium">
                Late: {summary.late}
              </span>

              <span className="text-red-700 font-medium">
                Absent: {summary.absent}
              </span>

              <span className="text-gray-600 font-medium">
                Excused: {summary.excused}
              </span>

              <span className="text-gray-400">
                No Selection: {summary.no_response}
              </span>

            </div>

            <AttendanceTable
              groupedMembers={sortedSections}
              action={updateAttendance}
              isLocked={isLocked}
              eventId={eventId}
              orchestraId={orchestraId}
            />

          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          <Card>
            <CardHeader title="Event Notes" />

            <div className="p-4">
              {event.notes || (
                <span className="text-gray-400">
                  No notes yet.
                </span>
              )}
            </div>

          </Card>

          <Card>
            <CardHeader title="Music" />

            <div className="p-4">
              <span className="text-gray-400">
                No music uploaded yet.
              </span>
            </div>

          </Card>

        </div>

      </div>

    </div>
  );  
}