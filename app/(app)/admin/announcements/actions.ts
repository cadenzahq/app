"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();

  // ✅ Get user (required for created_by)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // ✅ Get orchestra (authoritative source)
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) {
    throw new Error("No active orchestra");
  }

  // ✅ Extract + validate input
  const content = formData.get("content")?.toString().trim();

  if (!content) {
    throw new Error("Content is required");
  }

  // (Optional for v1, but schema supports it)
  const title = formData.get("title")?.toString().trim() || "Announcement";

  // ✅ INSERT + RETURN ROW (CRITICAL)
  const { data, error } = await supabase
    .from("announcements")
    .insert({
      orchestra_id: orchestra.id,
      content,
      title,
      created_by: user.id,
      is_pinned: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Announcement insert failed:", error);
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Insert failed: no data returned");
  }

  // ✅ Redirect AFTER success (never before)
  revalidatePath("/admin/announcements");
  redirect("/admin/announcements");
}