import { getAttendance } from "@/actions/member/getAttendance";
import { redirect } from "next/navigation";
import Link from "next/link";

import DashboardCard from "@/components/dashboard/DashboardCard";
import { formatEventDateTime } from "@/lib/utils/datetime";

export default async function MemberAttendancePage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  if (!orchestraId) {
    redirect("/login");
  }

  const attendance = await getAttendance(orchestraId);

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-midnight">
            Attendance
          </h1>

          <Link
            href={`/app/${orchestraId}/member/dashboard`}
            className="text-sm text-navy hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Content */}
        <DashboardCard title="Past Attendance">

          {attendance.length === 0 ? (
            <p className="text-sm text-gray-500">
              No attendance records yet.
            </p>
          ) : (
            <div className="space-y-4">
              {attendance.map((item) => (
                <div
                  key={item.event_id}
                  className="border border-navy/10 rounded-xl p-4 bg-white shadow-sm flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-midnight">
                      {item.event_name}
                    </div>

                    <div className="text-sm text-navy">
                      {formatEventDateTime(item.event_start_time)}
                    </div>
                  </div>

                  <AttendanceBadge status={item.attendance_status} />
                </div>
              ))}
            </div>
          )}

        </DashboardCard>

      </div>
    </div>
  );
}

/* --------------------------
   Badge
--------------------------- */

function AttendanceBadge({
  status,
}: {
  status: string;
}) {
  const base =
    "px-3 py-1 rounded-full text-xs font-medium";

  if (status === "present") {
    return <span className={`${base} bg-green-100 text-green-700`}>Present</span>;
  }

  if (status === "absent") {
    return <span className={`${base} bg-red-100 text-red-700`}>Absent</span>;
  }

  if (status === "late") {
    return <span className={`${base} bg-orange-100 text-orange-700`}>Late</span>;
  }

  if (status === "excused") {
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Excused</span>;
  }

  return (
    <span className={`${base} bg-gray-100 text-gray-600`}>
      Unmarked
    </span>
  );
}