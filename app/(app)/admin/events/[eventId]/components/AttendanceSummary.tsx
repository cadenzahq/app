function SummaryItem({ label, count }: any) {
  return (
    <div className="bg-gray-100 rounded-lg p-3 text-center">
      <div className="text-xl font-semibold">{count}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

export default function AttendanceSummary({ members, attendanceMap }: any) {

  let present = 0;
  let late = 0;
  let absent = 0;
  let excused = 0;

  members?.forEach((m: any) => {
    const status = attendanceMap.get(m.id)?.status;

    if (status === "Present") present++;
    else if (status === "Late") late++;
    else if (status === "Absent") absent++;
    else if (status === "Excused") excused++;
  });

  return (
    <div>

      <h2 className="text-lg font-semibold mb-3">
        Attendance Summary
      </h2>

      <div className="grid grid-cols-4 gap-4">

        <SummaryItem label="Present" count={present} />
        <SummaryItem label="Late" count={late} />
        <SummaryItem label="Absent" count={absent} />
        <SummaryItem label="Excused" count={excused} />

      </div>
    </div>
  );
}