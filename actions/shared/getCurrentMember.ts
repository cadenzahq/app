import { createClient } from "@/lib/supabase/server";

export async function getCurrentMember(orchestraId: string) {
  const supabase = await createClient();

  if (!orchestraId) return null;

  // 🔷 member_profile_v already scoped by auth.uid()
  const { data, error } = await supabase
    .from("member_profile_v")
    .select("*")
    .eq("orchestra_id", orchestraId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching current member:", error);
    return null;
  }

  return data;
}