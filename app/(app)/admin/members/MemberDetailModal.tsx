"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateMember, inactivateMember } from "./actions";

type MemberDetail = {
  member_id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  attendance_requirement: number | null;
  emergency_contact_name: string | null;

  instruments: {
    instrument_id: string;
    instrument: string;
    section: string;
    chair: number | null;
    is_primary: boolean;
  }[];
};

type Props = {
  memberId: string;
  onClose: () => void;
  instruments: {
    id: string;
    name: string;
  }[];
};

export default function MemberDetailModal({ memberId, onClose , instruments }: Props) {
  const supabase = createClient();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("admin_member_detail_view")
        .select("*")
        .eq("member_id", memberId)
        .single();

      setMember(data);
    }

    if (memberId) load();
  }, [memberId, supabase]);

  if (!member) return null;

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const form = e.currentTarget as HTMLFormElement;

    await updateMember(memberId, new FormData(form));

    onClose();
  }

  async function handleInactivate() {
    if (!confirm("Are you sure you want to inactivate this member?")) return;
    
    await inactivateMember(memberId);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg w-[500px] p-6"
        >
          <div className="text-lg font-semibold mb-2">
            <input
              name="display_name"
              defaultValue={member.display_name}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <input name="email" defaultValue={member.email ?? ""} />
            <br />
            <input name="phone" defaultValue={member.phone ?? ""} />
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase text-gray-500 mb-1">
              Instrument
            </div>

            <select
              name="instrument_id"
              defaultValue={member.instruments?.[0]?.instrument_id ?? ""}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Instrument</option>
              {instruments.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm mb-4">
            Attendance Requirement:{" "}
            {member.attendance_requirement ?? "—"}%
          </div>

          {member.emergency_contact_name && (
            <div className="text-sm mb-4">
              Emergency Contact: {member.emergency_contact_name}
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-xl shadow-lg w-[500px] p-6">
          <div className="text-lg font-semibold mb-2">
            {member.display_name}
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <div>{member.email}</div>
            <br />
            <div>{member.phone}</div>
          </div>

          <div className="mb-4">
            <div className="text-xs uppercase text-gray-500 mb-1">
              Instrument
            </div>

            {member.instruments?.map((inst, i) => (
              <div key={i} className="text-sm">
                {inst.instrument}
                {inst.chair && ` (Chair ${inst.chair})`}
                {inst.is_primary && " • Primary"}
              </div>
            ))}
          </div>

          <div className="text-sm mb-4">
            Attendance Requirement:{" "}
            {member.attendance_requirement ?? "—"}%
          </div>

          {member.emergency_contact_name && (
            <div className="text-sm mb-4">
              Emergency Contact: {member.emergency_contact_name}
            </div>
          )}

          <div className="flex justify-between mt-4">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Close
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={handleInactivate}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Inactivate
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}