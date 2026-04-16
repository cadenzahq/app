"use client";

import EmptyState from "@/components/ui/EmptyState";
import type { Announcement } from "@/lib/types";

interface Props {
  announcements: Announcement[];
  isEmpty: boolean;
}

export default function AnnouncementsClient({
  announcements,
  isEmpty,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto p-10 bg-ivory min-h-screen">

      <h1 className="text-2xl font-semibold text-midnight mb-6">
        Announcements
      </h1>

      {isEmpty && (
        <EmptyState type="announcements" />
      )}

      {!isEmpty && (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="border border-navy/20 rounded-xl p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">

                <p className="text-sm text-navy">
                  {a.created_by_name} •{" "}
                  {new Date(a.created_at).toLocaleString()}
                </p>

                {a.is_pinned && (
                  <span className="text-xs font-medium text-gold">
                    Pinned
                  </span>
                )}

              </div>

              <h2 className="font-semibold text-midnight">
                {a.title}
              </h2>

              <p className="text-navy mt-1">
                {a.content}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}