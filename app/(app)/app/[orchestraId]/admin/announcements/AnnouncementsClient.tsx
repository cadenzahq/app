"use client";

import EmptyState from "@/components/ui/EmptyState";
import type { Announcement } from "@/lib/types";
import Link from "next/link";

interface Props {
  announcements: Announcement[];
  isEmpty: boolean;
  orchestraId: string; // ✅ NEW
}

export default function AnnouncementsClient({
  announcements,
  isEmpty,
  orchestraId,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto p-10 bg-ivory min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-midnight">
          Announcements
        </h1>

        <Link
          href={`/app/${orchestraId}/admin/announcements/new`}
          className="bg-midnight text-ivory px-4 py-2 rounded hover:bg-navy transition"
        >
          + New
        </Link>
      </div>

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