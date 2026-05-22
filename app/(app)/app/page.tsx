import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppRoot() {
  const supabase = await createClient();

  // 🔒 Get user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 🔷 Get first active membership
  const { data: memberships } = await supabase
    .from("members")
    .select("orchestra_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })
    .limit(1);

  const orchestraId = memberships?.[0]?.orchestra_id;

  if (!orchestraId) {
    // No memberships → force login (or onboarding later)
    redirect("/login");
  }

  // ✅ Redirect into scoped app
  redirect(`/app/${orchestraId}`);
}