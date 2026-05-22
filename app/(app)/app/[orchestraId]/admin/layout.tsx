import { redirect } from "next/navigation";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  // 🔒 Validate membership
  const member = await getCurrentMember(orchestraId);

  if (!member) {
    redirect("/login");
  }

  // 🔒 Role guard
  if (member.role === "member") {
    redirect(`/app/${orchestraId}/member/dashboard`);
  }

  return <>{children}</>;
}