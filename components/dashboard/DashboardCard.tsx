import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function DashboardCard({
  title,
  children,
  footer,
}: DashboardCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader title={title} />

      <div className="flex-1 px-3 py-3 overflow-y-auto">
        {children}
      </div>

      {footer && (
        <div className="px-2 pb-2">
          {footer}
        </div>
      )}
    </Card>
  );
}