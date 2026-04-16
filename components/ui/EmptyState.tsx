"use client";

import Link from "next/link";

type EmptyStateType = "events" | "members" | "announcements";

interface Props {
  type: EmptyStateType;
}

const config = {
  events: {
    title: "No events yet",
    description: "Create your first event to get started.",
    cta: "Create Event",
    href: "/admin/events/new",
  },
  members: {
    title: "No members yet",
    description: "Add members to begin managing your orchestra.",
    cta: "Add Member",
    href: "/admin/members/new",
  },
  announcements: {
    title: "No announcements yet",
    description: "Post an announcement to communicate with your group.",
    cta: "Create Announcement",
    href: "/admin/announcements/new",
  },
};

export default function EmptyState({ type }: Props) {
  const c = config[type];

  return (
    <div className="border border-navy/20 rounded-xl p-8 text-center bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-midnight mb-2">
        {c.title}
      </h2>

      <p className="text-navy text-sm mb-4">
        {c.description}
      </p>

      <Link
        href={c.href}
        className="inline-block bg-gold text-midnight px-4 py-2 rounded hover:opacity-90 transition"
      >
        {c.cta}
      </Link>
    </div>
  );
}