import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";
import EditEventForm from "@/components/admin/EditEventForm";

export default async function NewEventPage() {
  const supabase = await createClient();

  const orchestra = await getActiveOrchestraForUser(supabase);
  if (!orchestra) redirect("/admin/dashboard");

  const { data: seasons } = await supabase
    .from("seasons")
    .select("id, name")
    .eq("orchestra_id", orchestra.id)
    .order("name");

  return (
    <EditEventForm
      event={null}
      seasons={seasons ?? []}
      orchestraId={orchestra.id}
    />
  );
}