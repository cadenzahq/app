import { getEvents } from "@/actions/member/getEvents";
import { redirect } from "next/navigation";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EventRow from "./EventRow";

export default async function MemberEventsPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  if (!orchestraId) {
    redirect("/login");
  }

  const events = await getEvents(orchestraId);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-midnight">
            Events
          </h1>

          <Link
            href={`/app/${orchestraId}/member/dashboard`}
            className="text-sm text-navy hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <DashboardCard title="Upcoming Events">

          {events.length === 0 ? (
            <EmptyState type="events" />
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <EventRow
                  key={event.id}
                  event={event}
                  orchestraId={orchestraId}
                />
              ))}
            </div>
          )}

        </DashboardCard>

      </div>
    </div>
  );
}