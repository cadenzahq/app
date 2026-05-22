import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

type QuickAction = {
  label: string;
  href: (orchestraId: string) => string;
  variant: "primary" | "outline";
};

const actions: QuickAction[] = [
  {
    label: "View Events",
    href: (id) => `/app/${id}/member/events`,
    variant: "primary",
  },
  {
    label: "Announcements",
    href: (id) => `/app/${id}/member/announcements`,
    variant: "outline",
  },
];

export default function QuickActionsCard({
  orchestraId,
}: {
  orchestraId: string;
}) {
  return (
    <DashboardCard title="Quick Actions">
      <div className="flex flex-col gap-2">
        {actions.map((action) => (
          <Link key={action.label} href={action.href(orchestraId)}>
            <Button variant={action.variant} className="w-full">
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
    </DashboardCard>
  );
}