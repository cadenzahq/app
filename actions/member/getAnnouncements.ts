import { createClient } from "@/lib/supabase/server";

type MemberAnnouncement = {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  created_by_name: string | null;
};

export async function getAnnouncements(
  orchestraId: string
): Promise<MemberAnnouncement[]> {
  const supabase = await createClient();

  if (!orchestraId) return [];

  const { data, error } = await supabase
    .from("member_announcements_v")
    .select("*")
    .eq("orchestra_id", orchestraId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error);
    return []; // ✅ NEVER THROW
  }

  return data ?? [];
}