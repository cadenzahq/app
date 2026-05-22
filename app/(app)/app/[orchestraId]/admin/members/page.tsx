import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import { redirect } from "next/navigation";
import MembersTable from "./MembersTable";
import EmptyState from "@/components/ui/EmptyState";
import Link from "next/link";
import type {
  MemberListItem,
  Instrument,
} from "@/lib/types";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  const supabase = await createClient();

  // 🔒 Validate membership + role
  const member = await getCurrentMember(
    orchestraId
  );

  if (!member) {
    redirect("/login");
  }

  if (member.role === "member") {
    redirect(
      `/app/${orchestraId}/member/dashboard`
    );
  }

  const [
    { data: membersData, error },
    { data: instrumentsData },
  ] = await Promise.all([
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
      .eq("orchestra_id", orchestraId)
      .eq("is_active", true),

    supabase
      .from("instruments")
      .select(
        "id, name, section_id, sort_order"
      )
      .eq("orchestra_id", orchestraId)
      .order("name", {
        ascending: true,
      }),
  ]);

  if (error) {
    console.error(
      "Members fetch error:",
      error
    );

    return (
      <div className="text-sm text-red-600">
        Failed to load members
      </div>
    );
  }

  const members: MemberListItem[] =
    membersData ?? [];

  const instruments: Instrument[] =
    instrumentsData ?? [];

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-midnight">
            Members
          </h1>

          <Link
            href={`/app/${orchestraId}/admin/members/new`}
            className="bg-midnight text-ivory px-4 py-2 rounded hover:bg-navy transition"
          >
            + Add Member
          </Link>
        </div>

        {members.length === 0 ? (
          <EmptyState type="members" />
        ) : (
          <MembersTable
            members={members}
            instruments={instruments}
            orchestraId={orchestraId}
          />
        )}

      </div>
    </div>
  );
}