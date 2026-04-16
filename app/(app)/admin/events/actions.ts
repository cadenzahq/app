"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";

/*
Normalization helpers (single source of truth)
*/
function normalizeString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeRequiredString(value: FormDataEntryValue | null): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Missing required field");
  }
  return value.trim();
}

function normalizeDate(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  return new Date(value).toISOString();
}

/*
Centralized event parser (CREATE + UPDATE)
*/
function parseEventForm(formData: FormData) {
  return {
    name: normalizeRequiredString(formData.get("name")),
    event_type: normalizeString(formData.get("event_type")),
    start_time: normalizeDate(formData.get("start_time")),
    end_time: normalizeDate(formData.get("end_time")),
    location: normalizeString(formData.get("location")),
    description: normalizeString(formData.get("description")),
    notes: normalizeString(formData.get("notes")), // ✅ NEW (correct place)
    series_id: normalizeRequiredString(formData.get("series_id")),
  };
}

/*
Shared: Validate + derive series/season
*/
async function resolveSeriesContext(
  supabase: Awaited<ReturnType<typeof createClient>>,
  seriesId: string,
  orchestraId: string
) {
  const { data, error } = await supabase
    .from("event_series")
    .select("season_id, orchestra_id")
    .eq("id", seriesId)
    .single();

  if (error || !data) {
    throw new Error("Invalid series");
  }

  if (data.orchestra_id !== orchestraId) {
    throw new Error("Series does not belong to orchestra");
  }

  return data;
}

/*
CREATE EVENT
*/
export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const eventData = parseEventForm(formData);

  const series = await resolveSeriesContext(
    supabase,
    eventData.series_id,
    orchestra.id
  );

  const { error } = await supabase.from("events").insert({
    ...eventData,
    orchestra_id: orchestra.id,
    season_id: series.season_id,
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

  const series = await resolveSeriesContext(
    supabase,
    eventData.series_id,
    orchestra.id
  );

  const { error } = await supabase
    .from("events")
    .update({
      ...eventData,
      season_id: series.season_id,
      updated_at: new Date().toISOString(),
    })
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