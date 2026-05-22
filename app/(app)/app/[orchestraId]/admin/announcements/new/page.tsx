import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import { redirect } from "next/navigation";
import Link from "next/link";
import NewAnnouncementForm from "./NewAnnouncementForm";

export default async function NewAnnouncementPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  const supabase = await createClient();

  // 🔒 Validate access
  const member = await getCurrentMember(orchestraId);

  if (!member) {
    redirect("/login");
  }

  if (member.role === "member") {
    redirect(`/app/${orchestraId}/member/dashboard`);
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-8">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-midnight">
            New Announcement
          </h1>

          <Link
            href={`/app/${orchestraId}/admin/announcements`}
            className="text-sm text-navy hover:underline"
          >
            ← Back to Announcements
          </Link>
        </div>

        <NewAnnouncementForm
          orchestraId={orchestraId}
        />

      </div>
    </div>
  );
}