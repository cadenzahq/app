import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";
import MembersTable from "./MembersTable";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import type { MemberListItem, Instrument } from "@/lib/types";

export default async function MembersPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const [{ data: membersData, error }, { data: instrumentsData }] =
    await Promise.all([
      supabase
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
        .eq("is_active", true),

      supabase
        .from("instruments")
        .select("id, name, section_id, sort_order")
        .eq("orchestra_id", orchestra.id)
        .order("sort_order", { ascending: true }),
    ]);

  if (error) {
    console.error(error);
  }

  const members: MemberListItem[] = membersData ?? [];
  const instruments: Instrument[] = instrumentsData ?? [];

  const isEmpty = members.length === 0;

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-midnight">
            Members
          </h1>
          <Link
            href="/admin/members/new"
            className="bg-midnight text-ivory px-4 py-2 rounded hover:bg-navy transition"
          >
            + Add Member
          </Link>
        </div>

        {/* Empty State */}
        {isEmpty ? (
          <EmptyState type="members" />
        ) : (
          <MembersTable
            members={members}
            instruments={instruments}
          />
        )}

      </div>
    </div>
  );
}