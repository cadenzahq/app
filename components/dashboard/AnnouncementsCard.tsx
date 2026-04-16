import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_by_name: string;
  is_pinned: boolean;
}

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
            <li key={a.id}>
              <div className="flex justify-between items-center">
                <p className="font-medium">{a.title}</p>
                {a.is_pinned && (
                  <span className="text-xs text-indigo-600">
                    Pinned
                  </span>
                )}
              </div>

              <p className="text-gray-600">{a.content}</p>

              <p className="text-xs text-gray-400 mt-1">
                {a.created_by_name} •{" "}
                {new Date(a.created_at).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}