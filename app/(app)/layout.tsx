import Header from "@/components/header/Header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">

      <Header />

      <main className="max-w-6xl mx-auto px-6 py-6">
        {children}
      </main>

    </div>
  );
}