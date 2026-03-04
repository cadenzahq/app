import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";

interface TasksCardProps {
}

export default function TasksCard({
}: TasksCardProps) {
  return (
    <Card>
      <CardHeader title="Tasks" />

      <div className="text-sm text-gray-500">
        No pending tasks.
      </div>
    </Card>
  );
}