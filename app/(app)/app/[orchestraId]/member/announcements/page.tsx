import { getAnnouncements } from "@/actions/member/getAnnouncements";
import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import { formatEventDateTime } from "@/lib/utils/datetime";

export default async function MemberAnnouncementsPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  if (!orchestraId) {
    redirect("/login");
  }

  const announcements = await getAnnouncements(orchestraId);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-midnight">
            Announcements
          </h1>

          <Link
            href={`/app/${orchestraId}/member/dashboard`}
            className="text-sm text-navy hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <DashboardCard title="Latest Announcements">

          {announcements.length === 0 ? (
            <EmptyState type="announcements" />
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="border border-navy/10 rounded-xl p-4 bg-white shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-medium text-midnight">
                      {a.title}
                    </h2>

                    {a.is_pinned && (
                      <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded-full">
                        Pinned
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-navy whitespace-pre-wrap">
                    {a.content}
                  </p>

                  <div className="text-xs text-gray-400 mt-2">
                    {formatEventDateTime(a.created_at)}
                  </div>

                  {a.created_by_name && (
                    <div className="text-xs text-gray-400 mt-1">
                      Posted by {a.created_by_name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </DashboardCard>

      </div>
    </div>
  );
}