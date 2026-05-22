"use client";

import { useState } from "react";
import { formatEventDateTime } from "@/lib/utils/datetime";
import RSVPControls from "./RSVPControls";

type Event = {
  id: string;
  name: string;
  start_time: string;
  location: string | null;
  my_rsvp_status: "yes" | "no" | "maybe" | "pending" | null;
};

export default function EventRow({
  event,
  orchestraId,
}: {
  event: Event;
  orchestraId: string;
}) {
  const [status, setStatus] = useState(event.my_rsvp_status);

  return (
    <div className="border border-navy/10 rounded-xl p-4 bg-white shadow-sm space-y-3">

      {/* Event Info */}
      <div className="flex justify-between items-center">

        <div>
          <div className="text-lg font-medium text-midnight">
            {event.name}
          </div>

          <div className="text-sm text-navy">
            {formatEventDateTime(event.start_time)}
          </div>

          {event.location && (
            <div className="text-sm text-navy">
              {event.location}
            </div>
          )}
        </div>

        <RSVPBadge status={status} />

      </div>

      {/* RSVP Controls */}
      <RSVPControls
        orchestraId={orchestraId}
        eventId={event.id}
        currentStatus={status}
        onChange={setStatus}
      />

    </div>
  );
}

/* -------------------------- */

function RSVPBadge({ status }: { status: string | null }) {
  const base = "px-3 py-1 rounded-full text-xs font-medium";

  if (status === "yes")
    return <span className={`${base} bg-green-100 text-green-700`}>Attending</span>;

  if (status === "maybe")
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Maybe</span>;

  if (status === "no")
    return <span className={`${base} bg-red-100 text-red-700`}>Not Attending</span>;

  return (
    <span className={`${base} bg-gray-100 text-gray-600`}>
      Pending
    </span>
  );
}