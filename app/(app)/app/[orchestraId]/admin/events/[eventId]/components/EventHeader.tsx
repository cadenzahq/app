import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

type Props = {
  event: any
  series: { id: string; name: string }
  season: { id: string; name: string }
  isLocked: boolean
}

export default function EventHeader({
  event,
  series,
  season,
  isLocked,
}: Props) {

  const date = new Date(event.start_time).toLocaleDateString()

  async function toggleLock() {
    "use server"

    const supabase = await createClient()

    const { error } = await supabase
      .from("events")
      .update({ is_attendance_locked: !isLocked })
      .eq("id", event.id)

    if (error) {
      throw new Error("Failed to update attendance lock")
    }

    revalidatePath(`/admin/events/${event.id}`)
  }

  return (
    <div className="space-y-3">

      {/* Title */}
      <h1 className="text-3xl font-semibold">
        {event.name}
      </h1>

      {/* Meta */}
      <div className="text-gray-500">
        {date} • {event.location}
      </div>

      {/* Series / Season */}
      {(series || season) && (
        <div className="text-sm text-gray-400">
          {series?.name}
          {series && season && " • "}
          {season?.name}
        </div>
      )}

      {/* Lock State + Action */}
      <div className="flex items-center gap-3 pt-2">

        {/* Status Badge */}
        <span
          className={`px-2 py-1 text-xs rounded font-medium ${
            isLocked
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {isLocked ? "Attendance Locked" : "Attendance Open"}
        </span>

        {/* Toggle Button */}
        <form action={toggleLock}>
          <button
            type="submit"
            className={`px-3 py-1 text-sm rounded ${
              isLocked
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-red-600 text-white hover:bg-red-500"
            }`}
          >
            {isLocked ? "Unlock" : "Lock"}
          </button>
        </form>

      </div>

    </div>
  )
}