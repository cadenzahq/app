import { getEvents } from "@/actions/member/getEvents";
import { getAnnouncements } from "@/actions/member/getAnnouncements";
import { redirect } from "next/navigation";
import QuickActionsCard from "./components/QuickActionsCard";

import DashboardCard from "@/components/dashboard/DashboardCard";
import { formatEventDateTime } from "@/lib/utils/datetime";

export default async function DashboardContent({
  orchestraId,
}: {
  orchestraId: string;
}) {
  if (!orchestraId) {
    redirect("/login");
  }

  const events = await getEvents(orchestraId);
  const announcements = await getAnnouncements(orchestraId);

  const nextEvent = events?.[0] ?? null;

  function getRSVPStyles(status: string | null) {
    switch (status) {
      case "yes":
        return "bg-green-100 text-green-700";
      case "maybe":
        return "bg-yellow-100 text-yellow-700";
      case "no":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  }

  function getRSVPLabel(status: string | null) {
    switch (status) {
      case "yes":
        return "Attending";
      case "maybe":
        return "Maybe";
      case "no":
        return "Not Attending";
      default:
        return "Pending";
    }
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        <h1 className="text-3xl font-semibold text-midnight">
          Dashboard
        </h1>

        <div className="grid gap-4 md:grid-cols-2 items-stretch">

          <DashboardCard title="Next Event">
            {!nextEvent ? (
              <p className="text-sm text-gray-500">
                No upcoming events.
              </p>
            ) : (
              <div className="space-y-2">

                <div className="flex items-center justify-between">
                  <p className="font-medium text-midnight">
                    {nextEvent.name}
                  </p>

                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full ${getRSVPStyles(
                      nextEvent.my_rsvp_status
                    )}`}
                  >
                    {getRSVPLabel(nextEvent.my_rsvp_status)}
                  </span>
                </div>

                <p className="text-sm text-navy">
                  {formatEventDateTime(nextEvent.start_time)}
                </p>

                {nextEvent.location && (
                  <p className="text-sm text-navy">
                    {nextEvent.location}
                  </p>
                )}

              </div>
            )}
          </DashboardCard>

          <DashboardCard title="Announcements">
            {announcements.length === 0 ? (
              <p className="text-sm text-gray-500">
                No announcements.
              </p>
            ) : (
              <div className="space-y-4 text-sm">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id}>
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-midnight">
                        {a.title}
                      </p>

                      {a.is_pinned && (
                        <span className="text-xs text-gold">
                          Pinned
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600">
                      {a.content}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {a.created_by_name} •{" "}
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

        </div>

        <div className="grid gap-4 md:grid-cols-2 items-stretch">

          <QuickActionsCard orchestraId={orchestraId} />

          <DashboardCard title="Attendance">
            <p className="text-sm text-gray-500">
              Attendance insights coming soon.
            </p>
          </DashboardCard>

        </div>
      </div>
    </div>
  );
}