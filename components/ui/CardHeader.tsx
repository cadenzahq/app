import { ReactNode } from "react";

interface CardHeaderProps {
  title: string;
  action?: ReactNode;
}

export function CardHeader({
  title,
  action,
}: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        {title}
      </h2>
      {action}
    </div>
  );
}