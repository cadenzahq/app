import { createClient } from "@/lib/supabase/server";
import EditEventForm from "../[eventId]/components/EditEventForm";

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  const supabase = await createClient();

  const { data: seasons, error } = await supabase
    .from("seasons")
    .select("id, name")
    .eq("orchestra_id", orchestraId)
    .order("name");

  if (error) {
    console.error(
      "Seasons fetch error:",
      error
    );

      return null;
  }

  return (
    <EditEventForm
      event={null}
      seasons={seasons ?? []}
      orchestraId={orchestraId}
    />
  );
}