"use server";

import { createClient } from "@/lib/supabase/server";

export async function createSeason({
  name,
  orchestraId,
  start_date,
  end_date,
  is_current,
}: {
  name: string;
  orchestraId: string;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
}) {
  const supabase = await createClient();

  // 🔷 If setting current, unset others
  if (is_current) {
    const { error: resetError } = await supabase
      .from("seasons")
      .update({ is_current: false })
      .eq("orchestra_id", orchestraId);

    if (resetError) {
      console.error("Season reset error:", resetError);
      return null;
    }
  }

  // 🔷 Insert season
  const { data, error } = await supabase
    .from("seasons")
    .insert({
      name,
      orchestra_id: orchestraId,
      start_date: start_date ?? null,
      end_date: end_date ?? null,
      is_current: is_current ?? false,
    })
    .select()
    .single();

  if (error) {
    console.error("Season insert error:", error);
    return null;
  }

  return data ?? null;
}