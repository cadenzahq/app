"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import SendReminderButton from "@/components/admin/dashboard/SendReminderButton";
import RSVPStatCard from "@/components/dashboard/RSVPStatCard";
import { EventSummary , RSVPCounts} from "@/lib/types";

interface NextEventCardProps {
  event: EventSummary | null;
  rsvpCounts: RSVPCounts | null;
}

export default function NextEventCard({ event, rsvpCounts}: NextEventCardProps) {
    const [reminderMessage, setReminderMessage] = useState("");
    
    if (!event) {
        return (
            <Card>
            <CardHeader title="Next Event" />

            <div className="flex flex-col items-start gap-4 py-6">
                <p className="text-sm text-navy mb-4">
                No upcoming events.
                </p>

                <Link href="/admin/events/new">
                <Button>Create Event</Button>
                </Link>
            </div>
            </Card>
        );
    }

    const EMPTY_COUNTS: RSVPCounts = {
        yes: 0,
        maybe: 0,
        no: 0,
        pending: 0,
    };

    const counts = rsvpCounts ?? EMPTY_COUNTS;
    const formattedDate = new Date(event.start_time).toLocaleString();
    const eventUrl = `/admin/events/${event.id}`;
    const editUrl = `${eventUrl}/edit`;
    const attendanceUrl = `${eventUrl}#attendance`;

    const total =
        counts.yes +
        counts.maybe +
        counts.no +
        counts.pending;

    const attendanceRatio =
        total > 0 ? counts.yes / total : 0;

    let status = "Healthy";
    let statusColor = "bg-green-100 text-green-700";

    if (attendanceRatio < 0.5) {
        status = "Low Attendance";
        statusColor = "bg-red-100 text-red-700";
    } else if (counts.pending > total * 0.3) {
        status = "Waiting on RSVPs";
        statusColor = "bg-yellow-100 text-yellow-700";
    }

    return (
    <Card>
        <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-midnight">
            Next Event
        </h2>

        <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor}`}
        >
            {status}
        </span>
        </div>

        <div className="space-y-2 mb-6">
            <p className="font-medium text-midnight">{event.name}</p>
            <p className="text-sm text-navy">{formattedDate}</p>
            {event.location && (
                <p className="text-sm text-navy">{event.location}</p>
            )}
        </div>

        <div className="grid grid-cols-4 gap-3 mt-4">
            <RSVPStatCard
                label="Attending"
                value={counts.yes}
                color="green"
            />

            <RSVPStatCard
                label="Maybe"
                value={counts.maybe}
                color="yellow"
            />

            <RSVPStatCard
                label="Not Attending"
                value={counts.no}
                color="red"
            />

            <RSVPStatCard
                label="Pending"
                value={counts.pending}
                color="gray"
            />
        </div>

        {reminderMessage && (
            <div className="mt-3 text-right text-sm text-blue-700">
                {reminderMessage}
            </div>
        )}

        <hr className="my-3 border-navy/20" />

        <div className="grid grid-cols-2 gap-3">
            <Link href={eventUrl}>
                <Button variant="outline" className="w-full">
                    View Event
                </Button>
            </Link>

            <Link href={editUrl}>
                <Button variant="outline" className="w-full">
                    Edit Event
                </Button>
            </Link>

            <SendReminderButton
                eventId={event.id}
                pendingCount={counts.pending}
                disabled={counts.pending === 0}
                onSuccess={(msg) => setReminderMessage(msg)}
            />

            <Link href={attendanceUrl}>
                <Button className="w-full">
                    Mark Attendance
                </Button>
            </Link>
        </div>

    </Card>
    );
}