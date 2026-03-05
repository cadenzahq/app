import { redirect } from "next/navigation";
import { getActiveOrchestra } from "@/lib/orchestra";
import EditEventForm from "@/components/admin/EditEventForm";

export default async function NewEventPage() {
  const orchestra = await getActiveOrchestra();

  if (!orchestra) redirect("/admin/dashboard");

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Create Event
      </h1>

      <EditEventForm orchestraId={orchestra.id} />
    </div>
  );
}