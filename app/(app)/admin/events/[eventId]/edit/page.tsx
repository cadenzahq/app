import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import EditEventForm from "@/components/admin/EditEventForm";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { eventId } = await params;

  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const [eventRes, seriesRes, seasonsRes] = await Promise.all([
    supabase
      .from("events")
      .select(`
        id,
        name,
        event_type,
        start_time,
        end_time,
        location,
        description,
        series_id
      `)
      .eq("id", eventId)
      .eq("orchestra_id", orchestra.id)
      .maybeSingle(),

    supabase
      .from("event_series")
      .select("id, name, season_id")
      .eq("orchestra_id", orchestra.id)
      .order("name"),

    supabase
      .from("seasons")
      .select("id, name")
      .eq("orchestra_id", orchestra.id)
      .order("name"),
  ]);

console.log("seriesRes:", seriesRes);

  const event = eventRes.data;
  const series = seriesRes.data ?? [];
  const seasons = seasonsRes.data ?? [];

  if (!event) {
    return <div className="p-10">Event not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Edit Event
      </h1>

      <EditEventForm
        event={event}
        series={series}
        seasons={seasons}
      />
    </div>
  );
}