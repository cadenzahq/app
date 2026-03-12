import DashboardCard from "@/components/dashboard/DashboardCard";

interface AttendanceOverviewCardProps {
  attendanceRate: number;
  belowRequirement: number;
  totalMembers: number;
}

export default function AttendanceOverviewCard({
  attendanceRate,
  belowRequirement,
  totalMembers,
}: AttendanceOverviewCardProps) {

  const formattedRate = Number.isFinite(attendanceRate)
    ? `${attendanceRate.toFixed(0)}%`
    : "—";

  return (
    <DashboardCard title="Attendance Overview">
      <div className="text-center py-4">

        <div className="text-4xl font-semibold text-gray-900">
          {formattedRate}
        </div>

        <p className="text-sm text-gray-500 mt-1">
          Avg Attendance Rate
        </p>

        <div className="grid grid-cols-2 gap-4 mt-8 text-sm">

          <div>
            <div className="font-semibold">
              {belowRequirement}
            </div>
            <div className="text-gray-500">
              Below Requirement
            </div>
          </div>

          <div>
            <div className="font-semibold">
              {totalMembers}
            </div>
            <div className="text-gray-500">
              Active Members
            </div>
          </div>

        </div>

      </div>
    </DashboardCard>
  );
}