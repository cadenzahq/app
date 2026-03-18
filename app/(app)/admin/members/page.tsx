import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";
import MembersTable from "./MembersTable";

export default async function MembersPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const { data: members, error } = await supabase
    .from("admin_roster_grouped_view")
    .select(`
      member_id,
      display_name,
      email,
      instrument,
      instrument_label,
      role,
      attendance_requirement,
      section,
      section_label,
      show_section_header,
      show_instrument_header
    `)
    .eq("orchestra_id", orchestra.id)
    .eq("is_active", true);

  if (error) {
    console.error(error);
  }

  return <MembersTable members={members ?? []} />;
}