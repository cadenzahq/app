import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestra } from "@/lib/orchestra";

interface PageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;
  const supabase = await createClient();
  const orchestra = await getActiveOrchestra();

  if (!orchestra) {
    redirect("/admin/dashboard");
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id)
    .single();

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-semibold">{event.name}</h1>

      <div className="text-gray-600">
        {new Date(event.start_time).toLocaleString()}
      </div>

      {event.location && (
        <div className="text-gray-600">{event.location}</div>
      )}

      {event.description && (
        <div className="mt-4 text-gray-800">
          {event.description}
        </div>
      )}
    </div>
  );
}