"use client";

import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { Button } from "@/components/ui/Button";
import type { ButtonProps } from "@/components/ui/Button";
import Link from "next/link";

type QuickAction = {
  label: string;
  href: (orchestraId: string) => string; // ✅ FUNCTION
  variant: ButtonProps["variant"];
};

const actions: QuickAction[] = [
  {
    label: "Create Event",
    href: (id) => `/app/${id}/admin/events/new`,
    variant: "primary",
  },
  {
    label: "View All Events",
    href: (id) => `/app/${id}/admin/events`,
    variant: "outline",
  },
  {
    label: "Upload Music",
    href: (id) => `/app/${id}/admin/music`,
    variant: "outline",
  },
  {
    label: "View Roster",
    href: (id) => `/app/${id}/admin/members`,
    variant: "outline",
  },
];

export default function QuickActionsCard({
  orchestraId,
}: {
  orchestraId: string;
}) {
  return (
    <Card>
      <CardHeader title="Quick Actions" />

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <Link key={action.label} href={action.href(orchestraId)}>
            <Button variant={action.variant} className="w-full">
              {action.label}
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
}