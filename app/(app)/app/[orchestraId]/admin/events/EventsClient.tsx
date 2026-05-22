"use client";

import Link from "next/link";
import {
  formatEventDateTime,
  formatTimeRange,
} from "@/lib/utils/datetime";

import type { EventSummary } from "@/lib/types";
import EmptyState from "@/components/ui/EmptyState";

interface EventsClientProps {
  events: EventSummary[];
  isEmpty: boolean;
  orchestraId: string;
}

export default function EventsClient({
  events,
  isEmpty,
  orchestraId,
}: EventsClientProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-ivory min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-2xl font-semibold text-midnight">
          Events
        </h1>

        <Link
          href={`/app/${orchestraId}/admin/events/new`}
          className="bg-midnight text-ivory px-4 py-2 rounded hover:bg-navy transition"
        >
          + New Event
        </Link>

      </div>

      {/* Empty State */}
      {isEmpty ? (
        <EmptyState
          type="events"
        />
      ) : (
        <div className="space-y-4">

          {events.map((event) => (
            <div
              key={event.id}
              className="border border-navy/20 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">

                <div className="space-y-2">

                  <div className="text-lg font-semibold text-midnight">
                    {event.name}
                  </div>

                  <div className="text-sm text-navy/80">
                    {formatEventDateTime(
                      event.start_time
                    )}
                  </div>

                  <div className="text-sm text-navy/60">
                    {formatTimeRange(
                      event.start_time,
                      event.end_time
                    )}
                  </div>

                  {event.location && (
                    <div className="text-sm text-navy/60">
                      {event.location}
                    </div>
                  )}

                </div>

                <div className="flex flex-col items-end gap-2">

                  <Link
                    href={`/app/${orchestraId}/admin/events/${event.id}/edit`}
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