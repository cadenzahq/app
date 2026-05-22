"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import OrchestraSwitcher from "./OrchestraSwitcher";
import UserMenu from "./UserMenu";

type NavItem = {
  label: string;
  href: string;
};

type Membership = {
  orchestra_id: string;
  orchestras: {
    id: string;
    name: string;
  } | null;
};

type Props = {
  navItems: NavItem[];
  userName: string;
  memberships: Membership[];
  activeOrchestraId?: string;
};

export default function HeaderUI({
  navItems,
  userName,
  memberships,
  activeOrchestraId,
}: Props) {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-navy/30 bg-midnight text-ivory">
      <div className="w-full flex items-center justify-between px-6 py-4">

        {/* Left */}
        <div className="flex items-center gap-8">

          {/* Logo */}
          <Link href={`/app/${activeOrchestraId}`}>
            <Image
              src="/branding/Cadenza_2 Color Dark BG.svg"
              alt="Cadenza"
              width={140}
              height={40}
              priority
            />
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition-colors ${
                    isActive
                      ? "text-gold"
                      : "text-ivory hover:text-gold"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {memberships.length > 0 && (
            <OrchestraSwitcher
              memberships={memberships}
              activeOrchestraId={activeOrchestraId}
            />
          )}

          <UserMenu userName={userName} />
        </div>
      </div>
    </header>
  );
}