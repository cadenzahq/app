"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MemberDetail = {
  member_id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  attendance_requirement: number | null;
  emergency_contact_name: string | null;

  instruments: {
    instrument: string;
    section: string;
    chair: number | null;
    is_primary: boolean;
  }[];
};

type Props = {
  memberId: string;
  onClose: () => void;
};

export default function MemberDetailModal({ memberId, onClose }: Props) {
  const supabase = createClient();
  const [member, setMember] = useState<MemberDetail | null>(null);

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

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg w-[500px] p-6">
        <div className="text-lg font-semibold mb-2">
          {member.display_name}
        </div>

        <div className="text-sm text-gray-600 mb-4">
          {member.email}<br />
          {member.phone}
        </div>

        <div className="mb-4">
          <div className="text-xs uppercase text-gray-500 mb-1">
            Instruments
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

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 bg-gray-100 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}