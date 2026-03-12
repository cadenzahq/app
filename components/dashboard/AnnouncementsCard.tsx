import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Announcement } from "@/lib/types";

interface AnnouncementsCardProps {
  announcements: Announcement[];
}

export default function AnnouncementsCard({
  announcements,
}: AnnouncementsCardProps) {
  return (
    <DashboardCard
      title="Announcements"
      footer={
        <div className="grid grid-cols-2 gap-3">
          <Link href="/admin/announcements/new">
            <Button className="w-full">New</Button>
          </Link>

          <Link href="/admin/announcements">
            <Button variant="outline" className="w-full">
              View All
            </Button>
          </Link>
        </div>
      }
    >
      {announcements.length === 0 ? (
        <p className="text-sm text-gray-500">
          No announcements yet.
        </p>
      ) : (
        <ul className="space-y-4 text-sm">
          {announcements.map((a) => (
            <li key={a.id} className="text-sm text-gray-700">
              {a.content}
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}