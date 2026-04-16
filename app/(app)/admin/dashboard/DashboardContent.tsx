import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { getDashboardData } from "@/lib/dashboard";

import NextEventCard from "@/components/dashboard/NextEventCard";
import AttendanceOverviewCard from "@/components/dashboard/AttendanceOverviewCard";
import AnnouncementsCard from "@/components/dashboard/AnnouncementsCard";
import TasksCard from "@/components/dashboard/TasksCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";

export default async function DashboardContent() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center text-midnight">
        No orchestra selected
      </div>
    );
  }

  const dashboard = await getDashboardData(orchestra.id);

  // ✅ LOCAL SAFE NORMALIZATION (non-destructive)
  const safeDashboard = {
    next_event: dashboard?.next_event ?? null,
    rsvp_counts: dashboard?.rsvp_counts ?? {
      yes: 0,
      maybe: 0,
      no: 0,
      pending: 0,
    },
    announcements: dashboard?.announcements ?? [],
    tasks: dashboard?.tasks ?? [],
    summary: {
      attendance_rate: dashboard?.summary?.attendance_rate ?? 0,
      active_members: dashboard?.summary?.active_members ?? 0,
    },
  };

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

        <h1 className="text-3xl font-semibold text-midnight">
          {orchestra.name} Dashboard
        </h1>

        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-2">
            <NextEventCard
              event={safeDashboard.next_event}
              rsvpCounts={safeDashboard.rsvp_counts}
            />
          </div>

          <AnnouncementsCard announcements={safeDashboard.announcements} />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch">
          <AttendanceOverviewCard
            attendanceRate={safeDashboard.summary.attendance_rate}
            belowRequirement={0}
            totalMembers={safeDashboard.summary.active_members}
          />

          <QuickActionsCard />
          <TasksCard tasks={safeDashboard.tasks} />
        </div>

      </div>
    </div>
  );
}