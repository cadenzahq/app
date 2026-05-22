import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import { redirect } from "next/navigation";
import { getNavigation } from "@/lib/navigation";

import HeaderUI from "./HeaderUI";

export default async function Header({
  orchestraId,
}: {
  orchestraId: string;
}) {
  const supabase = await createClient();

  // 🔷 Auth user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 🔷 Member (authoritative)
  const member = await getCurrentMember(orchestraId);

  if (!member) {
    redirect("/login");
  }

  // 🔷 Role → navigation
  const navItems = getNavigation(member.role, orchestraId);

  // 🔷 Memberships (for switcher)
  const { data, error } = await supabase
    .from("members")
    .select(`
      orchestra_id,
      orchestras (
        id,
        name
      )
    `)
    .eq("user_id", user.id)
    .eq("is_active", true);

  console.log("HEADER memberships error:", error);

  console.log(
    "HEADER memberships data:",
    JSON.stringify(data, null, 2)
  );

  const memberships =
    (data ?? []).map((m) => ({
      orchestra_id: m.orchestra_id as string,
      orchestras: Array.isArray(m.orchestras)
        ? m.orchestras[0]
        : m.orchestras,
    })) ?? [];

  return (
    <HeaderUI
      navItems={navItems}
      userName={member.display_name || user.email || "User"}
      memberships={memberships}
      activeOrchestraId={orchestraId} // ✅ source of truth
    />
  );
}