import { SupabaseClient } from "@supabase/supabase-js";

type Orchestra = {
  id: string;
  name: string;
};

export async function getActiveOrchestraForUser(
  supabase: SupabaseClient,
  activeOrchestraId: string | null
): Promise<Orchestra | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: memberships } = await supabase
    .from("members")
    .select("orchestra_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!memberships || memberships.length === 0) return null;

  const normalizedId =
    activeOrchestraId && activeOrchestraId.trim() !== ""
      ? activeOrchestraId
      : null;

  let selectedMembership = memberships.find(
    (m) => m.orchestra_id === normalizedId
  );

console.log("RAW activeOrchestraId:", JSON.stringify(activeOrchestraId));

  // ❌ If cookie exists but doesn't match → reject
  if (!selectedMembership) {
    return null;
  }

  const selectedId = selectedMembership.orchestra_id;

  const { data: orchestra } = await supabase
    .from("orchestras")
    .select("id, name")
    .eq("id", selectedMembership.orchestra_id)
    .single();

  return orchestra ?? null;
}