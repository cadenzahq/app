import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface QuickActionsCardProps {
}

export default function QuickActionsCard({
}: QuickActionsCardProps) {
  return (
    <Card>
      <CardHeader title="Quick Actions" />

      <div className="flex flex-col gap-3">
        <Link href="/admin/events/new">
            <Button variant="primary" className="w-full">
                Create Event
            </Button>
        </Link>

        <Link href="/admin/music">
        <Button variant="outline" className="w-full">
            Upload Music
        </Button>
        </Link>

        <Link href="/admin/members">
            <Button variant="outline" className="w-full">
                View Roster
            </Button>
        </Link>
      </div>
    </Card>
  );
}