"use server";

import { createClient } from "@/lib/supabase/server";
import { ok, fail, type ActionResult } from "@/lib/actions";
import { localInputToUTC } from "@/lib/utils/datetime";

/*
Normalization helpers
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

function normalizeDate(
  value: FormDataEntryValue | null
): string | null {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return null;
  }

  return localInputToUTC(value);
}

function parseEventForm(formData: FormData) {
  return {
    name: normalizeRequiredString(formData.get("name")),
    event_type: normalizeString(formData.get("event_type")),
    start_time: normalizeDate(formData.get("start_time")),
    end_time: normalizeDate(formData.get("end_time")),
    location: normalizeString(formData.get("location")),
    description: normalizeString(formData.get("description")),
    notes: normalizeString(formData.get("notes")),
    series_id: normalizeRequiredString(formData.get("series_id")),
  };
}

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

  if (error || !data) return null;
  if (data.orchestra_id !== orchestraId) return null;

  return data;
}

/*
CREATE EVENT
*/
export async function createEvent(
  orchestraId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const eventData = parseEventForm(formData);

    const series = await resolveSeriesContext(
      supabase,
      eventData.series_id,
      orchestraId
    );

    if (!series) {
      return fail("Invalid series for this orchestra");
    }

    const { error } = await supabase.from("events").insert({
      ...eventData,
      orchestra_id: orchestraId,
      season_id: series.season_id,
    });

    if (error) {
      console.error(error);
      return fail("Failed to create event");
    }

    return ok();
  } catch (err) {
    console.error("createEvent crash:", err);
    return fail("Unexpected error");
  }
}

/*
UPDATE EVENT
*/
export async function updateEvent(
  eventId: string,
  orchestraId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const eventData = parseEventForm(formData);

    const series = await resolveSeriesContext(
      supabase,
      eventData.series_id,
      orchestraId
    );

    if (!series) {
      return fail("Invalid series for this orchestra");
    }

    const { error } = await supabase
      .from("events")
      .update({
        ...eventData,
        season_id: series.season_id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)
      .eq("orchestra_id", orchestraId);

    if (error) {
      console.error(error);
      return fail("Failed to update event");
    }

    return ok();
  } catch (err) {
    console.error("updateEvent crash:", err);
    return fail("Unexpected error");
  }
}

/*
DELETE EVENT
*/
export async function deleteEvent(
  eventId: string,
  orchestraId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId)
      .eq("orchestra_id", orchestraId);

    if (error) {
      console.error(error);
      return fail("Failed to delete event");
    }

    return ok();
  } catch (err) {
    console.error("deleteEvent crash:", err);
    return fail("Unexpected error");
  }
}