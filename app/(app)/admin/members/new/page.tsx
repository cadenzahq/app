import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { redirect } from "next/navigation";
import { createMember } from "../actions";
import Link from "next/link";

export default async function NewMemberPage() {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) redirect("/admin/dashboard");

  const { data: instruments } = await supabase
    .from("instruments")
    .select("id, name")
    .eq("orchestra_id", orchestra.id)
    .order("name", { ascending: true });

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-midnight">
            Add Member
          </h1>

          <Link
            href="/admin/members"
            className="text-sm text-navy hover:underline"
          >
            ← Back to Members
          </Link>
        </div>

        {/* Form */}
        <form action={createMember} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-navy/20">

          {/* Name */}
          <div className="flex gap-4">
            <input
              name="first_name"
              placeholder="First name"
              required
              className="w-full border border-navy/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <input
              name="last_name"
              placeholder="Last name"
              required
              className="w-full border border-navy/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Contact */}
          <div className="flex gap-4">
            <input
              name="email"
              placeholder="Email"
              className="w-full border border-navy/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <input
              name="phone"
              placeholder="Phone"
              className="w-full border border-navy/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Instrument */}
          <div>
            <label className="block text-sm text-navy mb-1">
              Instrument
            </label>
            <select
              name="instrument_id"
              required
              className="w-full border border-navy/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="">Select instrument</option>
              {(instruments ?? []).map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          {/* Attendance */}
          <div>
            <label className="block text-sm text-navy mb-1">
              Attendance Requirement (%)
            </label>
            <input
              name="attendance_requirement"
              type="number"
              placeholder="e.g. 75"
              className="w-full border border-navy/20 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/members"
              className="px-4 py-2 bg-ivory border border-navy/20 rounded text-midnight hover:bg-navy/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="px-4 py-2 bg-midnight text-ivory rounded hover:bg-navy transition"
            >
              Create Member
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}