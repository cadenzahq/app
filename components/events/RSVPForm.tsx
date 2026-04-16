"use client";

import { useState, useTransition } from "react";
import { updateRSVPStatusAction } from "@/actions/admin/send-rsvps";

type RSVPStatus = "yes" | "maybe" | "no" | "pending";

export default function RSVPForm({
  eventId,
  memberId,
  initialStatus,
}: {
  eventId: string;
  memberId: string;
  initialStatus: RSVPStatus;
}) {
  const [status, setStatus] = useState<RSVPStatus>(initialStatus);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      await updateRSVPStatusAction({
        eventId,
        memberId,
        status,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-3">
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value as RSVPStatus);
          setSaved(false);
        }}
        className="w-full border border-navy/20 rounded px-3 py-2 text-midnight"
      >
        <option value="pending">No Response</option>
        <option value="yes">Attending</option>
        <option value="maybe">Maybe</option>
        <option value="no">Not Attending</option>
      </select>

      <button
        onClick={handleSave}
        disabled={isPending}
        className="w-full bg-midnight text-ivory py-2 rounded hover:bg-navy transition"
      >
        {isPending ? "Saving..." : saved ? "Saved ✓" : "Save"}
      </button>
    </div>
  );
}