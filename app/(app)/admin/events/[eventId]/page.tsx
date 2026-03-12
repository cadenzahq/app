import { createClient } from "@/lib/supabase/server"
import { getActiveOrchestraForUser } from "@/lib/orchestra"
import { redirect } from "next/navigation"

import EventHeader from "./components/EventHeader"
import AttendanceTable from "./components/AttendanceTable"
import SeriesEvents from "./components/SeriesEvents"
import { Card } from "@/components/ui/Card"
import { CardHeader } from "@/components/ui/CardHeader"

type AttendanceMember = {
  member_id: string
  full_name: string
  instrument: string | null
  instrument_sort_order: number | null
  section: string | null
  section_sort_order: number | null
  attendance_status: string | null
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params

  const supabase = await createClient()
  const orchestra = await getActiveOrchestraForUser(supabase)

  if (!orchestra) return <div>No active orchestra</div>

  const { data: event } = await supabase
    .from("events")
    .select(`
      *,
      event_series (
        id,
        name,
        seasons (
          id,
          name
        )
      )
    `)
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id)
    .maybeSingle()

  if (!event) return <div>Event not found</div>

  const series = event.event_series
  const season = event.event_series?.seasons

  const { data: members } = await supabase
    .from("event_member_attendance")
    .select("*")
    .eq("orchestra_id", orchestra.id)
    .eq("event_id", eventId)

  if (!members) redirect("/admin/dashboard")

  const summary = members.reduce(
    (acc, member) => {
      const status = member.attendance_status ?? "no_response"

      acc.total += 1

      if (status === "present") acc.present += 1
      else if (status === "late") acc.late += 1
      else if (status === "absent") acc.absent += 1
      else if (status === "excused") acc.excused += 1
      else acc.no_response += 1

      return acc
    },
    {
      total: 0,
      present: 0,
      late: 0,
      absent: 0,
      excused: 0,
      no_response: 0,
    }
  )

  const grouped = members.reduce<Record<string, AttendanceMember[]>>(
    (acc, member) => {
      const section = member.section ?? "Other"

      if (!acc[section]) acc[section] = []
      acc[section].push(member)

      return acc
    },
    {}
  )

  Object.values(grouped).forEach(sectionMembers => {
    sectionMembers.sort((a, b) => {
      const aOrder = a.instrument_sort_order ?? 999
      const bOrder = b.instrument_sort_order ?? 999
      return aOrder - bOrder
    })
  })
  
  const sortedSections = Object.entries(grouped).sort((a, b) => {
    const aOrder = a[1][0]?.section_sort_order ?? 999
    const bOrder = b[1][0]?.section_sort_order ?? 999
    return aOrder - bOrder
  })

  const { data: seriesEvents } = await supabase
    .from("events")
    .select("id, name, start_time")
    .eq("series_id", event.series_id)
    .order("start_time")

  async function updateAttendance(formData: FormData) {
    "use server"

    const supabase = await createClient()

    const memberId = formData.get("memberId") as string
    const status = formData.get("status") as string

    await supabase
      .from("attendance")
      .upsert({
        member_id: memberId,
        event_id: eventId,
        status,
      })
  }

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-10">

      {/* LEFT COLUMN */}
      <div className="space-y-8">

        <EventHeader
          event={event}
          series={series}
          season={season}
        />

        <SeriesEvents
          events={seriesEvents}
          currentEventId={eventId}
        />

        <div id="attendance">

          <h2 className="text-xl font-semibold mb-2">Attendance</h2>

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
          />

        </div>

      </div>

      {/* RIGHT SIDEBAR */}
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
  )
}