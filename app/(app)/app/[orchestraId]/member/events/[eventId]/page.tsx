import { getEventDetail } from "@/actions/member/getEventDetail";
import RSVPSection from "./RSVPSection";
import { notFound } from "next/navigation";

export default async function EventDetailPage({
  params,
}: {
  params: { orchestraId: string; eventId: string };
}) {
  const event = await getEventDetail(
    params.eventId,
    params.orchestraId
  );

  if (!event) {
    notFound();
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-midnight">
          {event.name}
        </h1>

        <div className="text-ivory/70 text-sm mb-1">
          {new Date(event.start_time).toLocaleString()}
        </div>

        <div className="text-ivory/70 text-sm mb-3">
          {event.location}
        </div>

        {event.description && (
          <p className="text-ivory text-sm">{event.description}</p>
        )}
      </div>

      <RSVPSection
        eventId={event.id}
        currentStatus={event.my_rsvp_status}
        orchestraId={params.orchestraId}
      />
    </div>
  );
}