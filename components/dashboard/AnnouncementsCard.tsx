import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Announcement {
  id: string;
  content: string;
  created_at: string;
}

interface AnnouncementsCardProps {
  announcements: Announcement[];
}

export default function AnnouncementsCard({
  announcements,
}: AnnouncementsCardProps) {
  return (
    <Card>
        <CardHeader title="Announcements" />

        {announcements.length === 0 ? (
        <p className="text-sm text-gray-500 mb-6">
            No announcements yet.
        </p>
        ) : (
        <ul className="space-y-4 mb-6">
            {announcements.map((a) => (
            <li
                key={a.id}
                className="text-sm text-gray-700 line-clamp-2"
            >
                {a.content}
            </li>
            ))}
        </ul>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
            <Link href="/admin/announcements/new">
                <Button variant="outline" className="w-full">
                    New
                </Button>
            </Link>

            <Link href="/admin/announcements">
                <Button variant="outline" className="w-full">
                    View All
                </Button>
            </Link>
        </div>
    </Card>
  );
}