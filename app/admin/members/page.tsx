import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestra } from "@/lib/orchestra";
import { redirect } from "next/navigation";

export default async function MembersPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestra();

  if (!orchestra) redirect("/admin/dashboard");

  type Profile = {
    first_name: string | null;
    last_name: string | null;
    preferred_name: string | null;
    email: string | null;
  };

  type MemberWithProfile = {
    id: string;
    role: string | null;
    instrument: string | null;
    section: string | null;
    attendance_requirement: number | null;
    is_active: boolean;
    profiles: Profile | null;
  };

  const { data: members } = await supabase
    .from("members")
    .select(`
      id,
      role,
      instrument,
      section,
      attendance_requirement,
      is_active,
      profiles (
        first_name,
        last_name,
        preferred_name,
        email
      )
    `)
    .eq("orchestra_id", orchestra.id)
    .eq("is_active", true)
    .order("section")
    .order("instrument")
    .overrideTypes<MemberWithProfile[], { merge: false }>();

  const sortedMembers = [...(members ?? [])].sort((a, b) => {
    const sectionCompare = (a.section ?? "").localeCompare(b.section ?? "");
    if (sectionCompare !== 0) return sectionCompare;

    return (a.instrument ?? "").localeCompare(b.instrument ?? "");
  });

  let currentSection = "";

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-50 border-b text-gray-600">
        <tr>
            <th className="text-left px-6 py-3">Member</th>
            <th className="text-left px-6 py-3">Instrument</th>
            <th className="text-left px-6 py-3">Role</th>
            <th className="text-left px-6 py-3">Attendance</th>
        </tr>
        </thead>

        <tbody>
        {sortedMembers.map((member) => {
            const profile = member.profiles;

            const displayName =
            profile?.preferred_name ||
            profile?.first_name ||
            "";

            const fullName = `${displayName} ${profile?.last_name ?? ""}`;

            const showSectionHeader =
            member.section !== currentSection;

            if (showSectionHeader) {
            currentSection = member.section ?? "";
            }

            return (
            <>
                {showSectionHeader && (
                <tr className="bg-gray-100 border-t">
                    <td
                    colSpan={4}
                    className="px-6 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                    {member.section ?? "Other"}
                    </td>
                </tr>
                )}

                <tr className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-3">
                    <div className="font-medium">{fullName}</div>
                    <div className="text-xs text-gray-500 truncate">
                    {profile?.email}
                    </div>
                </td>

                <td className="px-6 py-3">
                    {member.instrument ?? "—"}
                </td>

                <td className="px-6 py-3 capitalize">
                    {member.role}
                </td>

                <td className="px-6 py-3">
                    {member.attendance_requirement ?? "—"}%
                </td>
                </tr>
            </>
            );
        })}

        {!members?.length && (
            <tr>
            <td
                colSpan={4}
                className="px-6 py-8 text-center text-gray-500"
            >
                No active members found.
            </td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}