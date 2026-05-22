"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMember } from "../actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewMemberForm({
  instruments,
  orchestraId,
}: {
  instruments: { id: string; name: string }[];
  orchestraId: string; // ✅ NEW
}) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const result = await createMember(orchestraId, formData); // ✅ FIX

    if (!result.success) {
      setError(result.error || "Something went wrong");
      setIsSubmitting(false);
      return;
    }

    showToast({ message: "Member created", type: "success" });

    router.push(`/app/${orchestraId}/admin/members`); // ✅ FIX
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-navy/20"
    >
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <input
          name="first_name"
          placeholder="First name"
          required
          className="w-full border border-navy/20 p-2 rounded"
        />
        <input
          name="last_name"
          placeholder="Last name"
          required
          className="w-full border border-navy/20 p-2 rounded"
        />
      </div>

      <div className="flex gap-4">
        <input
          name="email"
          placeholder="Email"
          className="w-full border border-navy/20 p-2 rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          className="w-full border border-navy/20 p-2 rounded"
        />
      </div>

      <select
        name="instrument_id"
        required
        className="w-full border border-navy/20 p-2 rounded"
      >
        <option value="">Select instrument</option>
        {instruments.map((inst) => (
          <option key={inst.id} value={inst.id}>
            {inst.name}
          </option>
        ))}
      </select>

      <input
        name="attendance_requirement"
        type="number"
        placeholder="Attendance %"
        className="w-full border border-navy/20 p-2 rounded"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() =>
            router.push(`/app/${orchestraId}/admin/members`)
          }
          className="px-4 py-2 bg-ivory border border-navy/20 rounded text-midnight"
        >
          Cancel
        </button>

        <Button type="submit" loading={isSubmitting}>
          Create Member
        </Button>
      </div>
    </form>
  );
}