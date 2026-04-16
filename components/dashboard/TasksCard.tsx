import DashboardCard from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface TasksCardProps {
  tasks: {
    event_id: string;
    title: string;
    is_complete: boolean;
  }[];
}

export default function TasksCard({ tasks }: TasksCardProps) {
  return (
    <DashboardCard title="Tasks">
      <div className="flex flex-col h-full">

        <div className="flex-1 flex flex-col gap-3 max-h-[160px] overflow-y-auto">
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500">
              No pending tasks.
            </p>
          ) : (
            tasks.map(task => (
              <label
                key={task.event_id}
                className="flex items-center gap-3 text-sm"
              >
                <input type="checkbox" />
                {task.title}
              </label>
            ))
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/admin/tasks/new">
            <Button variant="outline" className="w-full">
              New
            </Button>
          </Link>

          <Link href="/admin/tasks">
            <Button variant="outline" className="w-full">
              View All
            </Button>
          </Link>
        </div>

      </div>
    </DashboardCard>
  );
}