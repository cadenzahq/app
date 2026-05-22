export default function Loading() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">

        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />

        <div className="space-y-3">
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        </div>

      </div>
    </div>
  );
}