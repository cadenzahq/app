import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { getDashboardData } from "@/lib/dashboard"
import type { EventSummary } from "@/lib/types";
import NextEventCard from "@/components/dashboard/NextEventCard";
import AttendanceOverviewCard from "@/components/dashboard/AttendanceOverviewCard";
import AnnouncementsCard from "@/components/dashboard/AnnouncementsCard";
import TasksCard from "@/components/dashboard/TasksCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) {
    return <div>No orchestra selected</div>;
  }

  const dashboard = await getDashboardData(orchestra.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-5 space-y-4">

        <h1 className="text-3xl font-semibold tracking-tight mb-4">
          {orchestra.name} Dashboard
        </h1>

        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch">

          <div className="lg:col-span-2">
            <NextEventCard
              event={dashboard.next_event as EventSummary | null}
              rsvpCounts={dashboard.rsvp_counts}
            />
          </div>

          <AnnouncementsCard announcements={dashboard.announcements} />

        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch">
          <AttendanceOverviewCard
            attendanceRate={dashboard.summary?.attendance_rate ?? 0}
            belowRequirement={0}
            totalMembers={dashboard.summary?.active_members ?? 0}
          />

          <QuickActionsCard />
          <TasksCard tasks={dashboard.tasks} />
        </div>

      </div>
    </div>
  );
}