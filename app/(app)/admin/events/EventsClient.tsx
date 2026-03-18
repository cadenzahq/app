"use client";

import Link from "next/link";
import { formatEventDateTime, formatTimeRange } from "@/lib/utils/datetime";
import type { EventSummary } from "@/lib/types";

interface EventsClientProps {
  events: EventSummary[];
  orchestraId: string;
}

export default function EventsClient({
  events,
  orchestraId,
}: EventsClientProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">
          Events
        </h1>

        <Link
          href={`/admin/events/new`}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          + Create Event
        </Link>
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <div className="text-gray-500 text-sm">
          No events yet.
        </div>
      )}

      {/* Event List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start gap-4">

              {/* Left Side */}
              <div className="space-y-1">
                <div className="text-lg font-semibold">
                  {event.name}
                </div>

                <div className="text-sm text-gray-500">
                  {formatEventDateTime(event.start_time)}
                </div>

                <div className="text-sm text-gray-500">
                  {formatTimeRange(event.start_time, event.end_time)}
                </div>

                {event.location && (
                  <div className="text-sm text-gray-500">
                    {event.location}
                  </div>
                )}
              </div>

              {/* Right Side */}
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/admin/events/${event.id}/edit`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}