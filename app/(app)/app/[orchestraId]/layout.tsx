import Header from "@/components/header/Header";

export default async function OrchestraLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } = await params; // ✅ REQUIRED

  return (
    <div className="min-h-screen bg-ivory">
      <Header orchestraId={orchestraId} />

      <main className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}