"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Button } from "@/components/ui/Button";
import type { RSVPCounts } from "@/lib/types";
import { useState } from "react";
import SendReminderButton from "@/components/admin/dashboard/SendReminderButton";

interface Event {
  id: string;
  name: string;
  start_time: string;
  location: string | null;
}

interface NextEventCardProps {
  event: Event | null;
  rsvpCounts: RSVPCounts | null;
}

export default function NextEventCard({ event, rsvpCounts}: NextEventCardProps) {
  if (!event) {
    return (
      <Card>
        <CardHeader title="Next Event" />

        <div className="flex flex-col items-start gap-4 py-6">
            <p className="text-sm text-gray-500 mb-4">
            No upcoming events.
            </p>

            <Link href="/admin/events/new">
            <Button>Create Event</Button>
            </Link>
        </div>
      </Card>
    );
  }

const [reminderMessage, setReminderMessage] = useState("");
const counts = rsvpCounts ?? { yes: 0, maybe: 0, no: 0, pending: 0 };

  return (
    <Card>
      <CardHeader title="Next Event" />

        <div className="space-y-2 mb-6">
        <p className="font-medium text-gray-900">
            {event.name}
        </p>
        <p className="text-sm text-gray-500">
            {new Date(event.start_time).toLocaleString()}
        </p>
        {event.location && (
            <p className="text-sm text-gray-500">
            {event.location}
            </p>
        )}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-green-700">
                {counts.yes}
            </div>
            <div className="text-xs text-green-600">
                Attending
            </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-yellow-700">
                {counts.maybe}
            </div>
            <div className="text-xs text-yellow-600">
                Maybe
            </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-red-700">
                {counts.no}
            </div>
            <div className="text-xs text-red-600">
                Not Attending
            </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-lg font-semibold text-gray-700">
                {counts.pending}
            </div>
            <div className="text-xs text-gray-600">
                Pending
            </div>
            </div>
        </div>

        {reminderMessage && (
        <div className="mt-3 grid grid-cols-4 gap-4">
            <div className="col-start-3 col-span-2">
            <div className="text-sm text-blue-700 text-right">
                {reminderMessage}
            </div>
            </div>
        </div>
        )}

        <hr className="my-3 border-gray-200" />

        <div className="grid grid-cols-2 gap-3">
        <Link href={`/admin/events/${event.id}`}>
            <Button variant="outline" className="w-full">
                View Event
            </Button>
        </Link>

        <Link href={`/admin/events/${event.id}/edit`}>
            <Button variant="outline" className="w-full">
                Edit Event
            </Button>
        </Link>

        <SendReminderButton
            eventId={event.id}
            pendingCount={rsvpCounts?.pending ?? 0}
            onSuccess={(msg) => setReminderMessage(msg)}
        />

        <Link href={`/admin/events/${event.id}/attendance`}>
            <Button className="w-full">
                Mark Attendance
            </Button>
        </Link>
        </div>

    </Card>
  );
}