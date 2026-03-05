import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestra } from "@/lib/orchestra";
import EditEventForm from "@/components/admin/EditEventForm";

interface EditEventPageProps {
  params: {
    eventId: string;
  };
}

export default async function EditEventPage(
  props: EditEventPageProps
) {
  const { eventId } = await props.params;
  const supabase = await createClient();
  const orchestra = await getActiveOrchestra();

  if (!orchestra) {
    redirect("admin/dashboard");
  }

  // Fetch event
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id)
    .single();

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
        orchestraId={orchestra.id}
        />
    </div>
);
}