import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestra } from "@/lib/orchestra";
import { RSVP_STATUS } from "@/lib/constants";
import type { RSVPCounts } from "@/lib/types";
import NextEventCard from "@/components/dashboard/NextEventCard";
import AttendanceOverviewCard from "@/components/dashboard/AttendanceOverviewCard";
import AnnouncementsCard from "@/components/dashboard/AnnouncementsCard";
import TasksCard from "@/components/dashboard/TasksCard";
import QuickActionsCard from "@/components/dashboard/QuickActionsCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const orchestra = await getActiveOrchestra();

  //if (!orchestra) redirect("/select-orchestra");
if (!orchestra) {
  return <div>No orchestra found</div>;
}

  type Event = {
    id: string;
    name: string;
    start_time: string;
    location: string | null;
  };

  // 1. Fetch next upcoming event
  const { data } = await supabase
    .from("events")
    .select("id, name, start_time, location")
    .eq("orchestra_id", orchestra.id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle();
  const nextEvent = data as Event | null;

  // 2. Fetch RSVP counts if event exists
  let rsvpCounts: RSVPCounts | null = null;

  if (nextEvent) {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("status")
      .eq("event_id", nextEvent.id)
      .eq("orchestra_id", orchestra.id);

    if (rsvps) {
        const counts = rsvps.reduce(
        (acc, r) => {
            acc[r.status as keyof RSVPCounts]++;
            return acc;
        },
        { yes: 0, maybe: 0, no: 0, pending: 0 }
        );

        rsvpCounts = counts;

    }
  }
  const pendingRSVP = rsvpCounts?.pending ?? 0;

  // 3. Fetch active members
  const { data: members } = await supabase
    .from("members")
    .select("id")
    .eq("orchestra_id", orchestra.id)
    .eq("is_active", true);

  const activeMembers = members?.length ?? 0;

  // 4. Fetch attendance records
  const { data: attendance } = await supabase
    .from("attendance")
    .select("member_id, status")
    .eq("orchestra_id", orchestra.id);

  const totalMembers = members?.length ?? 0;

  const presentCount =
    attendance?.filter(a => a.status === "present").length ?? 0;

  const attendanceRate =
    totalMembers > 0
      ? Math.round((presentCount / totalMembers) * 100)
      : 0;

  // 5. Calculate members below requirement
  let belowRequirement = 0;

  if (attendance) {
    const absenceMap: Record<string, number> = {};

    attendance.forEach(record => {
      if (record.status === "absent") {
        absenceMap[record.member_id] =
          (absenceMap[record.member_id] || 0) + 1;
      }
    });

    belowRequirement = Object.values(absenceMap).filter(
      absences => absences >= 3
    ).length;
  }

  // 6. Fetch announcements
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, content, created_at")
    .eq("orchestra_id", orchestra.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          {orchestra.name} Dashboard
        </h1>

        {/* Top Section */}
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
            <NextEventCard
                event={nextEvent}
                rsvpCounts={rsvpCounts}
            />
            </div>

            <div className="flex flex-col gap-8">     
            <AttendanceOverviewCard
                attendanceRate={attendanceRate}
                belowRequirement={belowRequirement}
                totalMembers={totalMembers}
            />

            <AnnouncementsCard
                announcements={announcements ?? []}
            />
            </div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-8 md:grid-cols-2">
          <TasksCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}