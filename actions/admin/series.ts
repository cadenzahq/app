"use server";

import { createClient } from "@/lib/supabase/server";

export async function createSeries({
  name,
  season_id,
  orchestra_id,
  description,
}: {
  name: string;
  season_id: string;
  orchestra_id: string;
  description?: string | null;
}) {
  const supabase = await createClient();

  // ✅ Validate that the season belongs to the orchestra
  const { data: season, error: seasonError } = await supabase
    .from("seasons")
    .select("id")
    .eq("id", season_id)
    .eq("orchestra_id", orchestra_id)
    .single();

  if (seasonError || !season) {
    throw new Error("Invalid season for this orchestra");
  }

  // ✅ Insert series
  const { data, error } = await supabase
    .from("event_series")
    .insert({
      name,
      season_id,
      orchestra_id,
      description: description ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}