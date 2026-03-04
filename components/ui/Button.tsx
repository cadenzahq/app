import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary";
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
    const base =
    "flex w-full items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  const variants = {
    primary:
    "bg-indigo-600 text-white hover:bg-indigo-700",
    outline:
    "border border-gray-300 bg-white hover:bg-gray-50",
    secondary:
    "bg-indigo-400 text-white hover:bg-indigo-500",
  };

  return (
    <button
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}