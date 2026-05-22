import DashboardContent from "./Dashboard Content";

export default async function Page({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params;

  return <DashboardContent orchestraId={orchestraId} />;
}