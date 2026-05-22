import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import { getDashboardData } from "@/lib/dashboard";
import { redirect } from "next/navigation";

import NextEventCard from "@/app/(app)/app/[orchestraId]/admin/dashboard/components/NextEventCard";
import AttendanceOverviewCard from "@/app/(app)/app/[orchestraId]/admin/dashboard/components/AttendanceOverviewCard";
import AnnouncementsCard from "@/app/(app)/app/[orchestraId]/admin/dashboard/components/AnnouncementsCard";
import TasksCard from "@/app/(app)/app/[orchestraId]/admin/dashboard/components/TasksCard";
import QuickActionsCard from "@/app/(app)/app/[orchestraId]/admin/dashboard/components/QuickActionsCard";

export default async function DashboardContent({
  orchestraId,
}: {
  orchestraId: string;
}) {
  const supabase = await createClient();

  // 🔒 Validate membership + role (CRITICAL)
  const member = await getCurrentMember(orchestraId);

  if (!member) {
    redirect("/login");
  }

  if (member.role === "member") {
    redirect(`/app/${orchestraId}/member/dashboard`);
  }

  // 🔷 Fetch dashboard data (already scoped correctly)
  const dashboard = await getDashboardData(orchestraId);

  // ✅ SAFE NORMALIZATION (keep this exactly as you had it)
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

        {/* Title */}
        <h1 className="text-3xl font-semibold text-midnight">
          {member.orchestra_name
            ? `${member.orchestra_name} Dashboard`
            : "Dashboard"}
        </h1>

        {/* Top Section */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch">
          <div className="lg:col-span-2">
            <NextEventCard
              event={safeDashboard.next_event}
              rsvpCounts={safeDashboard.rsvp_counts}
              orchestraId={orchestraId}  
            />
          </div>

          <AnnouncementsCard
            announcements={safeDashboard.announcements}
            orchestraId={orchestraId}   
          />
        </div>

        {/* Bottom Section */}
        <div className="grid gap-4 lg:grid-cols-3 items-stretch">

          <AttendanceOverviewCard
            attendanceRate={safeDashboard.summary.attendance_rate}
            belowRequirement={0}
            totalMembers={safeDashboard.summary.active_members}
          />

          <QuickActionsCard orchestraId={orchestraId} /> 

          <TasksCard
            tasks={safeDashboard.tasks}
            orchestraId={orchestraId} 
          />

        </div>

      </div>
    </div>
  );
}