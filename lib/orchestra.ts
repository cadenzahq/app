import { cookies } from "next/headers";
import { SupabaseClient } from "@supabase/supabase-js";

type Orchestra = {
  id: string;
  name: string;
};

export async function getActiveOrchestraForUser(
  supabase: SupabaseClient
): Promise<Orchestra | null> {

  const cookieStore = await cookies();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const activeOrchestraId =
    cookieStore.get("active_orchestra_id")?.value;

  const { data: memberships } = await supabase
    .from("members")
    .select("orchestra_id")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (!memberships || memberships.length === 0)
    return null;

  const selectedId =
    memberships.find(m => m.orchestra_id === activeOrchestraId)
      ?.orchestra_id ?? memberships[0].orchestra_id;

  const { data: orchestra } = await supabase
    .from("orchestras")
    .select("id, name")
    .eq("id", selectedId)
    .single();

  if (!orchestra) return null;

  return orchestra;
}