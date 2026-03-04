import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveOrchestra } from "@/lib/orchestra";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function AttendancePage({ params }: PageProps) {
  const { eventId } = await params;

  const supabase = await createClient();
  const orchestra = await getActiveOrchestra();

  if (!orchestra) {
    redirect("/admin/dashboard");
  }

  const { data: event } = await supabase
    .from("events")
    .select("id, name")
    .eq("id", eventId)
    .eq("orchestra_id", orchestra.id)
    .single();

  if (!event) {
    return <div className="p-10">Event not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-semibold">
        Mark Attendance — {event.name}
      </h1>

      <p className="text-gray-600">
        Attendance management UI coming next.
      </p>
    </div>
  );
}