import DashboardContent from "./DashboardContent";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params; // ✅ REQUIRED

  return <DashboardContent orchestraId={orchestraId} />;
}