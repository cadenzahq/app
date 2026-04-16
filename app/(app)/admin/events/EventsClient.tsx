"use client";

import Link from "next/link";
import { formatEventDateTime, formatTimeRange } from "@/lib/utils/datetime";
import type { EventSummary } from "@/lib/types";
import EmptyState from "@/components/ui/EmptyState";

interface EventsClientProps {
  events: EventSummary[];
  isEmpty: boolean;
}

export default function EventsClient({
  events,
  isEmpty,
}: EventsClientProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-ivory min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-midnight">
          Events
        </h1>

        <Link
          href="/admin/events/new"
          className="bg-midnight text-ivory px-4 py-2 rounded hover:bg-navy transition"
        >
          + Create Event
        </Link>
      </div>

      {/* Empty State */}
      {isEmpty && (
        <EmptyState type="events" />
      )}

      {/* Event List */}
      {!isEmpty && (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border border-navy/20 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">

                {/* Left */}
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-midnight">
                    {event.name}
                  </div>

                  <div className="text-sm text-navy">
                    {formatEventDateTime(event.start_time)}
                  </div>

                  <div className="text-sm text-navy">
                    {formatTimeRange(event.start_time, event.end_time)}
                  </div>

                  {event.location && (
                    <div className="text-sm text-navy">
                      {event.location}
                    </div>
                  )}
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-2">
                  <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="text-gold text-sm hover:underline"
                  >
                    Edit
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}