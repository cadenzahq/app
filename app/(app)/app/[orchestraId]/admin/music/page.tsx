import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

export default async function MusicPage({
  params,
}: {
  params: Promise<{ orchestraId: string }>;
}) {
  const { orchestraId } =
    await params;

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">

          <h1 className="text-2xl font-semibold text-midnight">
            Music Library
          </h1>

          <Link
            href={`/app/${orchestraId}/admin/dashboard`}
            className="text-sm text-navy hover:underline"
          >
            ← Back to Dashboard
          </Link>

        </div>

        <div className="space-y-6">

          <div className="border border-navy/20 rounded-xl p-6 bg-white shadow-sm">

            <h2 className="text-lg font-semibold text-midnight mb-2">
              Sheet Music Management
            </h2>

            <p className="text-sm text-navy">
              Upload PDFs and organize music libraries
              for your members.
            </p>

          </div>

          <EmptyState
            type="announcements"
          />

          <div className="border-2 border-dashed border-navy/20 rounded-xl p-10 bg-white text-center">

            <div className="text-midnight font-medium mb-2">
              🚧 Music uploads coming in v2
            </div>

            <p className="text-sm text-navy">
              Drag & drop PDFs here or browse
              files once music management
              launches.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}