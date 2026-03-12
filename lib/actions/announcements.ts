"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();

  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) {
    redirect("/admin/dashboard");
  }

  const content = formData.get("content") as string;

  if (!content?.trim()) {
    return;
  }

  await supabase.from("announcements").insert({
    content,
    orchestra_id: orchestra.id,
  });

  // Immediately refresh dashboard materialized view
  await supabase.rpc("refresh_dashboard_summary");

  redirect("/admin/dashboard");
}