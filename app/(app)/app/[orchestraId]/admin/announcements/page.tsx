import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import { redirect } from "next/navigation";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AnnouncementsPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  const supabase = await createClient();

  // 🔒 Validate access
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

  const {
    data: announcements,
    error,
  } = await supabase
    .from("announcements_dashboard_v")
    .select(`
      id,
      title,
      content,
      is_pinned,
      created_at,
      created_by_name
    `)
    .eq("orchestra_id", orchestraId)
    .order("is_pinned", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Announcements fetch error:",
      error
    );

    return (
      <AnnouncementsClient
        announcements={[]}
        isEmpty={true}
        orchestraId={orchestraId}
      />
    );
  }

  const announcementsData =
    announcements ?? [];

  return (
    <AnnouncementsClient
      announcements={announcementsData}
      isEmpty={
        announcementsData.length === 0
      }
      orchestraId={orchestraId}
    />
  );
}