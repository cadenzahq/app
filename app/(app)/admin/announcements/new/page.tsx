import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { createAnnouncement } from "@/app/(app)/admin/announcements/actions";

export default async function NewAnnouncementPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-6">
          New Announcement
        </h1>

        <form action={createAnnouncement} className="space-y-4">
          <input
            type="text"
            name="title"
            required
            placeholder="Title"
            className="w-full border rounded-md p-3"
          />

          <textarea
            name="content"
            required
            className="w-full border rounded-md p-3"
            rows={5}
            placeholder="Write announcement..."
          />

          <button
            type="submit"
            className="bg-midnight text-ivory px-4 py-2 rounded hover:bg-navy transition"
          >
            Post Announcement
          </button>
        </form>
      </div>
    </div>
  );
}