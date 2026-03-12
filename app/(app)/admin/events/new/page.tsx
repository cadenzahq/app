import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import EditEventForm from "@/components/admin/EditEventForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewEventPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

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