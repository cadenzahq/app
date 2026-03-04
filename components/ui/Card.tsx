import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
}