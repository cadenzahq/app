"use client";

import { useState, useTransition } from "react";
import type { ActionResult } from "@/lib/actions";

type Props = {
  memberId: string;
  memberName: string;
  instrument: string | null;
  initialStatus: string;
  action: (args: {
    eventId: string;
    orchestraId: string;
    memberId: string;
    status: string | null;
  }) => Promise<ActionResult>;
  isLocked: boolean;
  eventId: string;
  orchestraId: string;
};

const ATTENDANCE_OPTIONS = [
  "present",
  "late",
  "absent",
  "excused",
];

const STATUS_STYLES: Record<string, string> = {
  present: "bg-green-50 border-green-400 text-green-700",
  late: "bg-yellow-50 border-yellow-400 text-yellow-700",
  absent: "bg-red-50 border-red-400 text-red-700",
  excused: "bg-gray-100 border-gray-400 text-gray-600",
  "": "border-gray-300",
};

export default function AttendanceRow({
  memberId,
  memberName,
  instrument,
  initialStatus,
  action,
  isLocked,
  eventId,
  orchestraId,
}: Props) {
  // 🔷 LOCAL STATE (TOP)
  const [status, setStatus] = useState(
    initialStatus === "unmarked" ? "" : initialStatus
  );

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 🔷 HANDLER (AFTER STATE)
  function handleChange(newStatus: string) {
    if (isLocked) return;

    setStatus(newStatus);
    setSaved(false);
    setError(null);

    startTransition(async () => {
      const result = await action({
        eventId,
        orchestraId,
        memberId,
        status: newStatus || null,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 1500);
    });
  }

  return (
    <tr>

      <td className="py-2">{memberName}</td>

      <td className="py-2">{instrument ?? "—"}</td>

      <td className="py-2 flex flex-col gap-1">

        <div className="flex items-center gap-2">

          <select
            value={status}
            onChange={(e) => handleChange(e.target.value)}
            disabled={isLocked || isPending}
            className={`border rounded px-2 py-1 text-sm
              ${STATUS_STYLES[status] ?? "border-gray-300"}
            `}
          >
            <option value="">No Selection</option>

            {ATTENDANCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>

          {/* Status indicator */}
          <span className="text-xs text-gray-500 w-16">
            {isPending
              ? "Saving..."
              : saved
              ? "Saved ✓"
              : ""}
          </span>

        </div>

        {/* 🔴 ERROR UI (ALWAYS UNDER INPUT) */}
        {error && (
          <div className="text-xs text-red-600">
            {error}
          </div>
        )}

      </td>

    </tr>
  );
}