import { createClient } from "@/lib/supabase/server"
import { getActiveOrchestraForUser } from "@/lib/orchestra"
import { redirect } from "next/navigation"

import EventHeader from "./components/EventHeader"
import AttendanceTable from "./components/AttendanceTable"
import SeriesEvents from "./components/SeriesEvents"
import { Card } from "@/components/ui/Card"
import { CardHeader } from "@/components/ui/CardHeader"
import { revalidatePath } from "next/cache"

type AttendanceMember = {
  member_id: string
  full_name: string
  instrument: string | null
  instrument_sort_order: number
  section: string
  section_sort_order: number
  attendance_status: string
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const resolvedParams = await params
  const eventId = resolvedParams.eventId

  const supabase = await createClient()
  const orchestra = await getActiveOrchestraForUser(supabase)

  if (!orchestra) return <div>No active orchestra</div>

  const { data: event, error } = await supabase
    .from("event_detail")
    .select("*")
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id)
    .single()

  if (!event) return <div>Event not found</div>

  const isLocked = event.is_attendance_locked;

  const series = {
    id: event.series_id,
    name: event.series_name,
  }

  const season = {
    id: event.season_id,
    name: event.season_name,
  }

  const { data: members } = await supabase
    .from("event_member_attendance")
    .select("*")
    .eq("orchestra_id", orchestra.id)
    .eq("event_id", eventId)

  if (!members) redirect("/admin/dashboard")

  const summary = members.reduce(
    (acc, member) => {
      const status = member.attendance_status

      acc.total += 1

      if (status === "present") acc.present += 1
      else if (status === "late") acc.late += 1
      else if (status === "absent") acc.absent += 1
      else if (status === "excused") acc.excused += 1
      else if (status === "unmarked") acc.no_response += 1

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
      const section = member.section

      if (!acc[section]) acc[section] = []
      acc[section].push(member)

      return acc
    },
    {}
  )

  Object.values(grouped).forEach(sectionMembers => {
    sectionMembers.sort((a, b) => {
      const aOrder = a.instrument_sort_order
      const bOrder = b.instrument_sort_order
      return aOrder - bOrder
    })
  })
  
  const sortedSections = Object.entries(grouped).sort((a, b) => {
    const aOrder = a[1][0]?.section_sort_order
    const bOrder = b[1][0]?.section_sort_order
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
    const rawStatus = formData.get("status") as string
    const status = rawStatus === "" ? null : rawStatus

    const { data, error } = await supabase
      .from("attendance")
      .upsert(
        {
          event_id: eventId,
          member_id: memberId,
          status,
        },
        {
          onConflict: "event_id,member_id",
        }
      )
      .select()
      .single()

    if (error) {
      console.error("Attendance update failed:", error)
      throw new Error(error.message)
    }

     revalidatePath(`/admin/events/${eventId}`)
  }

  return (
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
            isLocked={isLocked}
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