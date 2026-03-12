"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  memberId: string
  memberName: string
  instrument: string | null
  initialStatus: string | null
  action: (formData: FormData) => Promise<void>
}

const ATTENDANCE_OPTIONS = [
  "present",
  "late",
  "absent",
  "excused"
]

const STATUS_STYLES: Record<string, string> = {
  present: "bg-green-50 border-green-400 text-green-700",
  late: "bg-yellow-50 border-yellow-400 text-yellow-700",
  absent: "bg-red-50 border-red-400 text-red-700",
  excused: "bg-gray-100 border-gray-400 text-gray-600",
}

export default function AttendanceRow({
  memberId,
  memberName,
  instrument,
  initialStatus,
  action
}: Props) {

  const router = useRouter()

  const [status, setStatus] = useState(initialStatus ?? "")
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)

  const [isPending, startTransition] = useTransition()

  function handleSave() {

    const formData = new FormData()
    formData.append("memberId", memberId)
    formData.append("status", status)

    setDirty(false)

    startTransition(async () => {

      await action(formData)

      setSaved(true)

      router.refresh()

      setTimeout(() => {
        setSaved(false)
      }, 2000)

    })
  }

  return (
    <tr>

      <td className="py-2">{memberName}</td>

      <td className="py-2">{instrument ?? "—"}</td>

      <td className="py-2">

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setDirty(true)
            setSaved(false)
          }}
          className={`mr-2 border rounded px-2 py-1 text-sm
            ${STATUS_STYLES[status] ?? "border-gray-300"}
          `}
        >

          <option value="">No Selection</option>

          {ATTENDANCE_OPTIONS.map(option => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}

        </select>

        <button
          onClick={handleSave}
          disabled={!dirty || isPending}
          className={`px-2 py-1 rounded text-xs font-medium ${
            (!dirty || isPending)
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          {isPending
            ? "Saving..."
            : saved
            ? "Saved ✓"
            : "Save"}
        </button>

      </td>

    </tr>
  )
}