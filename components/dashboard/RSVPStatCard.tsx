interface RSVPStatCardProps {
  label: string;
  value: number;
  color: "green" | "yellow" | "red" | "gray";
}

export default function RSVPStatCard({
  label,
  value,
  color,
}: RSVPStatCardProps) {
  const colorMap = {
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border px-4 py-3 ${colorMap[color]}`}
    >
      <span className="text-xl font-semibold">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}