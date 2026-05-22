import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EditEventForm from "../components/EditEventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{
    orchestraId: string;
    eventId: string;
  }>;
}) {
  const { orchestraId, eventId } = await params;

  if (!orchestraId || !eventId) {
    redirect("/login");
  }

  const supabase = await createClient();

  const [eventRes, seasonsRes] = await Promise.all([
    supabase
      .from("events_with_meta")
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
      .eq("orchestra_id", orchestraId)
      .maybeSingle(),

    supabase
      .from("seasons")
      .select("id,name")
      .eq("orchestra_id", orchestraId)
      .order("name"),
  ]);

  if (eventRes.error) {
    console.error(
      "Edit event fetch error:",
      eventRes.error
    );

    redirect(`/app/${orchestraId}/admin/events`);
  }

  if (seasonsRes.error) {
    console.error(
      "Seasons fetch error:",
      seasonsRes.error
    );

    redirect(`/app/${orchestraId}/admin/events`);
  }

  const event = eventRes.data;
  const seasons = seasonsRes.data ?? [];

  if (!event) {
    redirect(`/app/${orchestraId}/admin/events`);
  }

  return (
    <EditEventForm
      event={event}
      seasons={seasons}
      orchestraId={orchestraId}
    />
  );
}