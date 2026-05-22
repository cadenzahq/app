import { cn } from "@/lib/utils/cn";
import { ButtonHTMLAttributes } from "react";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary" | "destructive";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  className,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors";

  const variants = {
    primary:
      "bg-midnight text-ivory hover:bg-navy",
    secondary:
      "bg-navy text-ivory hover:bg-midnight",
    outline:
      "border border-navy/20 bg-white text-midnight hover:bg-ivory",
    destructive:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      className={cn(
        base,
        variants[variant],
        (loading || disabled) && "opacity-60 cursor-not-allowed",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 border-2 border-ivory/70 border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}