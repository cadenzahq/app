import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const { data: announcements, error } = await supabase
    .from("announcements_dashboard_v")
    .select(`
      id,
      title,
      content,
      is_pinned,
      created_at,
      created_by_name
    `)
    .eq("orchestra_id", orchestra.id)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const announcementsData = announcements ?? [];
  const isEmpty = announcementsData.length === 0;

  return (
    <AnnouncementsClient
      announcements={announcementsData}
      isEmpty={isEmpty}
    />
  );
}