import { createClient } from "@/lib/supabase/server";
import EventsClient from "./EventsClient";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";

export default async function EventsPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) {
    return <div>No orchestra selected.</div>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // Validate user belongs to this orchestra
  const { data: membership } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", user.id)
    .eq("orchestra_id", orchestra.id)
    .single();

  if (!membership) {
    redirect("/dashboard"); // or 403 page
  }

  // (Optional: later add role check here)

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("orchestra_id", orchestra.id)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("REAL ERROR:", error.message);
  }

  return (
    <EventsClient
      initialEvents={events ?? []}
      orchestraId={orchestra.id}
    />
  );
}