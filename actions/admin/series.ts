"use server";

import { createClient } from "@/lib/supabase/server";

export async function createSeries({
  name,
  season_id,
  orchestraId,
  description,
}: {
  name: string;
  season_id: string;
  orchestraId: string;
  description?: string | null;
}) {
  const supabase = await createClient();

  // 🔷 Validate season belongs to orchestra
  const { data: season, error: seasonError } = await supabase
    .from("seasons")
    .select("id")
    .eq("id", season_id)
    .eq("orchestra_id", orchestraId)
    .maybeSingle();

  if (seasonError || !season) {
    console.error("Season validation error:", seasonError);
    return null;
  }

  // 🔷 Insert series
  const { data, error } = await supabase
    .from("event_series")
    .insert({
      name,
      season_id,
      orchestra_id: orchestraId,
      description: description ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error("Series insert error:", error);
    return null;
  }

  return data ?? null;
}