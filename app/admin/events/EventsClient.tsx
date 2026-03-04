"use client";

import { useState } from "react";
import EventModal from "@/components/admin/EventModal";
import { formatEventDateTime, formatTimeRange } from "@/lib/utils/datetime";
import type { Event } from "@/types/Event";

interface EventsClientProps {
  initialEvents: any[]; // or your Event type
  orchestraId: string;
}

export default function EventsClient({
  initialEvents,
  orchestraId,
}: EventsClientProps) {

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  function openCreate() {
    setSelectedEvent(null);
    setModalOpen(true);
  }

  function openEdit(event: Event) {
    setSelectedEvent(event);
    setModalOpen(true);
  }

  function handleSaved(savedEvent: Event) {

    const exists = events.find(e => e.id === savedEvent.id);

    if (exists) {
      setEvents(events.map(e =>
        e.id === savedEvent.id ? savedEvent : e
      ));
    } else {
      setEvents([...events, savedEvent]);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-semibold">
          Events
        </h1>

        <button
          onClick={openCreate}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Create Event
        </button>

      </div>


      <div className="space-y-3">

        {events.map(event => (

          <div
            key={event.id}
            className="border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow-md transition"
          >

            <div>

              <div className="font-semibold">
                {event.name}
              </div>

              <div className="text-gray-500 text-sm">
                {formatEventDateTime(event.start_time)}
              </div>

              <div className="text-gray-500 text-sm">
                {formatTimeRange(event.start_time, event.end_time)}
              </div>

              <div className="text-gray-500 text-sm">
                {event.location}
              </div>

            </div>

            <button
              onClick={() => openEdit(event)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>

          </div>

        ))}

      </div>

      {modalOpen && (
        <EventModal
          event={selectedEvent}
          orchestraId={orchestraId}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}

    </div>
  );
}