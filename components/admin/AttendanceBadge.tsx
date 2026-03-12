type Props = {
  attendanceStatus?: string;
};

export type AttendanceStatus =
  | "Present"
  | "Late"
  | "Absent"
  | "Excused";
  
export default function AttendanceBadge({ attendanceStatus }: Props) {
  const styles: Record<string, string> = {
    Present: "bg-green-100 text-green-700",
    Late: "bg-yellow-100 text-yellow-700",
    Absent: "bg-red-100 text-red-700",
    Excused: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-md font-medium ${
        styles[attendanceStatus ?? ""] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {attendanceStatus ?? "—"}
    </span>
  );
}