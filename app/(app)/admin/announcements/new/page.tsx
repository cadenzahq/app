import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestra } from "@/lib/orchestra";

export default async function NewAnnouncementPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestra();

  if (!orchestra) redirect("/admin/dashboard");

  async function createAnnouncement(formData: FormData) {
    "use server";

    const content = formData.get("content") as string;

    await supabase.from("announcements").insert({
      content,
      orchestra_id: orchestra,
    });

    redirect("/admin/dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">
        New Announcement
      </h1>

      <form action={createAnnouncement} className="space-y-4">
        <textarea
          name="content"
          required
          className="w-full border rounded-md p-3"
          rows={5}
          placeholder="Write announcement..."
        />

        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Post Announcement
        </button>
      </form>
    </div>
  );
}