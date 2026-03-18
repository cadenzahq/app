"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";

/*
Centralized helper so create + update stay consistent
*/
function parseEventForm(formData: FormData) {
  const start = formData.get("start_time") as string | null;
  const end = formData.get("end_time") as string | null;

  return {
    name: formData.get("name") as string,
    event_type: (formData.get("event_type") as string) || null,
    start_time: start ? new Date(start).toISOString() : null,
    end_time: end ? new Date(end).toISOString() : null,
    location: (formData.get("location") as string) || null,
    description: (formData.get("description") as string) || null,
    series_id: (formData.get("series_id") as string) || null,
  };
}

/*
CREATE EVENT
*/
export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const eventData = parseEventForm(formData);

  const { error } = await supabase
    .from("events")
    .insert({
      ...eventData,
      orchestra_id: orchestra.id,
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/events");
}

/*
UPDATE EVENT
*/
export async function updateEvent(
  eventId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const eventData = parseEventForm(formData);

  const { error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/events");
}

/*
DELETE EVENT
*/
export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/events");
}