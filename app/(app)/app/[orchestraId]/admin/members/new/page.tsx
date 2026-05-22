import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewMemberForm from "./NewMemberForm";

export default async function NewMemberPage({
  params,
}: {
  params: Promise<{ orchestraId:string }>;
}) {
  const supabase = await createClient();
  const { orchestraId } = await params;

  // 🔒 Validate access
  const member = await getCurrentMember(orchestraId);

  if (!member) {
    redirect("/login");
  }

  if (member.role === "member") {
    redirect(`/app/${orchestraId}/member/dashboard`);
  }

  // 🔷 Fetch instruments (scoped)
  const { data: instruments } = await supabase
    .from("instruments")
    .select("id, name")
    .eq("orchestra_id", orchestraId)
    .order("name", { ascending: true });

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-midnight">
            Add Member
          </h1>

          <Link
            href={`/app/${orchestraId}/admin/members`}
            className="text-sm text-navy hover:underline"
          >
            ← Back to Members
          </Link>
        </div>

        <NewMemberForm
          instruments={instruments ?? []}
          orchestraId={orchestraId} // ✅ CRITICAL
        />

      </div>
    </div>
  );
}