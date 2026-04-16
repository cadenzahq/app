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

  const { data: membership } = await supabase
    .from("members")
    .select("id")
    .eq("user_id", user.id)
    .eq("orchestra_id", orchestra.id)
    .single();

  if (!membership) {
    redirect("/dashboard");
  }

  const { data: events, error } = await supabase
    .from("events_list_v")
    .select("id, name, start_time, end_time, location")
    .eq("orchestra_id", orchestra.id)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("REAL ERROR:", error.message);
  }

  const eventsData = events ?? [];
  const isEmpty = eventsData.length === 0;

  return (
    <EventsClient
      events={eventsData}
      isEmpty={isEmpty}
    />
  );
}