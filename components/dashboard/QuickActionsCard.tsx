import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Button } from "@/components/ui/Button";
import type { ButtonProps } from "@/components/ui/Button";
import Link from "next/link";

type QuickAction = {
  label: string
  href: string
  variant: ButtonProps["variant"]
};

const actions: QuickAction[] = [
  {
    label: "Create Event",
    href: "/admin/events/new",
    variant: "primary",
  },
  {
    label: "Upload Music",
    href: "/admin/music",
    variant: "outline",
  },
  {
    label: "View Roster",
    href: "/admin/members",
    variant: "outline",
  },
];

export default function QuickActionsCard() {
  return (
    <Card>
      <CardHeader title="Quick Actions" />

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant={action.variant} className="w-full">
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}