import { createClient } from "@/lib/supabase/server";
import EventsClient from "./EventsClient";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function EventsPage({
  params,
}: {
  params: Promise<{
    orchestraId: string;
  }>;
}) {
  const { orchestraId } = await params;

  if (!orchestraId) {
    redirect("/login");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events_list_v")
    .select(`
      id,
      name,
      start_time,
      end_time,
      location
    `)
    .eq("orchestra_id", orchestraId)
    .order("start_time", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Events fetch error:",
      error
    );

    return (
      <div className="text-sm text-red-600">
        Unable to load events.
      </div>
    );
  }

  const events = data ?? [];

  return (
    <Suspense fallback={<EventsSkeleton />}>
      <EventsClient
        events={events}
        isEmpty={events.length === 0}
        orchestraId={orchestraId}
      />
    </Suspense>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-24 bg-gray-200 animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}