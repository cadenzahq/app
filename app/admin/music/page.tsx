export default function MusicPage() {
  return (
    <div className="max-w-5xl mx-auto p-10">
        <h1 className="text-2xl font-semibold mb-4">
            Upload Music
        </h1>

        <p className="text-gray-600">
            This page will allow admins to upload sheet music
            and distribute parts to members.
        </p>

        <p className="text-sm text-gray-500">
            🚧 Music library coming soon.
        </p>

        <div className="mt-6 border rounded-lg p-6 bg-gray-50 text-center text-gray-500">
            Drag & drop PDFs here or click to upload
        </div>

    </div>
  );
}