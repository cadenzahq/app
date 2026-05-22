"use client";

import { useState, useTransition } from "react";
import { upsertRSVP } from "@/actions/member/upsertRSVP";

type Props = {
  orchestraId: string;
  eventId: string;
  currentStatus: "yes" | "no" | "maybe" | "pending" | null;
  onChange?: (status: "yes" | "no" | "maybe") => void;
};

const OPTIONS: ("yes" | "maybe" | "no")[] = ["yes", "maybe", "no"];

export default function RSVPControls({
  orchestraId,
  eventId,
  currentStatus,
  onChange,
}: Props) {
  const [status, setStatus] = useState(currentStatus ?? "pending");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick(next: "yes" | "maybe" | "no") {
    setError(null);

    startTransition(async () => {
      const result = await upsertRSVP(orchestraId, eventId, next);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setStatus(next);
      onChange?.(next);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {OPTIONS.map((opt) => {
          const active = status === opt;

          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleClick(opt)}
              disabled={isPending || active}
              className={`px-3 py-1 text-xs rounded-md font-medium transition
                ${
                  active
                    ? getActiveStyle(opt)
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              {label(opt)}
            </button>
          );
        })}
      </div>

      {isPending && (
        <div className="text-xs text-gray-500">
          Saving...
        </div>
      )}

      {error && (
        <div className="text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}

/* helpers */

function label(value: string) {
  if (value === "yes") return "Yes";
  if (value === "maybe") return "Maybe";
  if (value === "no") return "No";
  return value;
}

function getActiveStyle(value: string) {
  if (value === "yes") return "bg-green-600 text-white";
  if (value === "maybe") return "bg-yellow-500 text-black";
  if (value === "no") return "bg-red-600 text-white";
  return "";
}