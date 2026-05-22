import { redirect } from "next/navigation";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";

export default async function AppEntry({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params; // ✅ FIX

  const member = await getCurrentMember(orchestraId);

  if (!member) {
    redirect("/login");
  }

  const isAdmin = member.role !== "member";

  if (isAdmin) {
    redirect(`/app/${orchestraId}/admin/dashboard`);
  } else {
    redirect(`/app/${orchestraId}/member/dashboard`);
  }
}