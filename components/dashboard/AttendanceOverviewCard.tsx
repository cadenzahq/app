import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";

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
  return (
    <Card>
      <CardHeader title="Attendance Overview" />

      <div className="mt-6 space-y-6">
        {/* Primary Stat */}
        <div className="text-center">
          <div className="text-4xl font-semibold tracking-tight">
            {attendanceRate}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Avg Attendance Rate
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-xl font-semibold">
              {belowRequirement}
            </div>
            <div className="text-sm text-gray-500">
              Below Requirement
            </div>
          </div>

          <div>
            <div className="text-xl font-semibold">
              {totalMembers}
            </div>
            <div className="text-sm text-gray-500">
              Active Members
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}