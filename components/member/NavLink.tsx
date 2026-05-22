"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`transition ${
        isActive
          ? "text-gold font-medium"
          : "text-ivory/70 hover:text-ivory"
      }`}
    >
      {children}
    </Link>
  );
}