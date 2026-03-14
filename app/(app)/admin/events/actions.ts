"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";

export async function updateEvent(
  eventId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const start = formData.get("start_time") as string;
  const end = formData.get("end_time") as string;

  const { error } = await supabase
    .from("events")
    .update({
      name: formData.get("name"),
      event_type: formData.get("event_type"),
      start_time: start ? new Date(start).toISOString() : null,
      end_time: end ? new Date(end).toISOString() : null,
      location: formData.get("location") || null,
      description: formData.get("description") || null,
      series_id: formData.get("series_id") || null,
    })
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/events");
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id);

  redirect("/admin/events");
}