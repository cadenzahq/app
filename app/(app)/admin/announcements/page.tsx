import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";

export default async function AnnouncementsPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("orchestra_id", orchestra.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Announcements
      </h1>

      <div className="space-y-4">
        {announcements?.map(a => (
          <div key={a.id} className="border rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-2">
              {new Date(a.created_at).toLocaleString()}
            </p>
            <p>{a.content}</p>
          </div>
        ))}

        {!announcements?.length && (
          <p className="text-gray-500">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}