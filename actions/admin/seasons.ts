"use server";

import { createClient } from "@/lib/supabase/server";

export async function createSeason({
  name,
  orchestra_id,
  start_date,
  end_date,
  is_current,
}: {
  name: string;
  orchestra_id: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
}) {
  const supabase = await createClient();

  // Optional: if setting a new current season, unset others
  if (is_current) {
    const { error: resetError } = await supabase
      .from("seasons")
      .update({ is_current: false })
      .eq("orchestra_id", orchestra_id);

    if (resetError) throw resetError;
  }

  const { data, error } = await supabase
    .from("seasons")
    .insert({
      name,
      orchestra_id,
      start_date: start_date ?? null,
      end_date: end_date ?? null,
      is_current: is_current ?? false,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}