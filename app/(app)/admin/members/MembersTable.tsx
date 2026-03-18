"use client";

import { useState, Fragment } from "react";
import MemberDetailModal from "./MemberDetailModal";

type MemberRow = {
  member_id: string;
  display_name: string;
  email: string | null;
  instrument: string | null;
  instrument_label: string | null;
  role: string | null;
  attendance_requirement: number | null;
  section: string | null;
  section_label: string | null;
  show_section_header: boolean;
  show_instrument_header: boolean;
};

export default function MembersTable({ members }: { members: MemberRow[] }) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-50 border-b text-gray-600">
          <tr>
            <th className="text-left px-6 py-3">Member</th>
            <th className="text-left px-6 py-3">Instrument</th>
            <th className="text-left px-6 py-3">Role</th>
            <th className="text-left px-6 py-3">Attendance</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <Fragment key={member.member_id}>
              {member.show_section_header && (
                <tr className="bg-gray-100 border-t">
                  <td
                    colSpan={4}
                    className="px-6 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {member.section_label ?? "Other"}
                  </td>
                </tr>
              )}

              {member.show_instrument_header && (
                <tr className="bg-gray-50">
                  <td
                    colSpan={4}
                    className="px-6 py-1 text-xs font-medium uppercase text-gray-400"
                  >
                    {member.instrument_label ?? "Other"}
                  </td>
                </tr>
              )}

              <tr
                onClick={() => setSelectedMember(member.member_id)}
                className="border-b hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="px-6 py-3">
                  <div className="font-medium">{member.display_name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {member.email}
                  </div>
                </td>

                <td className="px-6 py-3">
                  {member.instrument ?? "—"}
                </td>

                <td className="px-6 py-3 capitalize">
                  {member.role ?? "—"}
                </td>

                <td className="px-6 py-3">
                  {member.attendance_requirement
                    ? `${member.attendance_requirement}%`
                    : "—"}
                </td>
              </tr>
            </Fragment>
          ))}

          {!members.length && (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-8 text-center text-gray-500"
              >
                No active members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal OUTSIDE table (important fix) */}
      {selectedMember && (
        <MemberDetailModal
          memberId={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}