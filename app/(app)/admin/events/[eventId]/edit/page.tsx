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

  const [eventRes, seasonsRes] = await Promise.all([
    supabase
      .from("events_with_meta") // ✅ USE VIEW
      .select(`
        id,
        name,
        event_type,
        start_time,
        end_time,
        location,
        description,
        notes,
        series_id,
        season_id
      `)
      .eq("id", eventId)
      .eq("orchestra_id", orchestra.id)
      .maybeSingle(),

    supabase
      .from("seasons")
      .select("id, name")
      .eq("orchestra_id", orchestra.id)
      .order("name"),
  ]);

  const event = eventRes.data;
  const seasons = seasonsRes.data ?? [];

  if (!event) {
    return <div className="p-10">Event not found.</div>;
  }

  return (
    <EditEventForm
      event={event}
      seasons={seasons}
      orchestraId={orchestra.id}
    />
  );
}