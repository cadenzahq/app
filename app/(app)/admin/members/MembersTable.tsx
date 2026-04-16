"use client";

import { useState, Fragment } from "react";
import MemberDetailModal from "./MemberDetailModal";
import type { MemberListItem, Instrument } from "@/lib/types";

export default function MembersTable({
  members,
  instruments,
}: {
  members: MemberListItem[];
  instruments: Instrument[];
}) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <div className="border border-navy/20 rounded-xl overflow-hidden bg-white shadow-sm">

      <table className="w-full text-sm table-fixed">

        {/* Header */}
        <thead className="bg-ivory border-b border-navy/20 text-navy">
          <tr>
            <th className="text-left px-6 py-3">Member</th>
            <th className="text-left px-6 py-3">Instrument</th>
            <th className="text-left px-6 py-3">Role</th>
            <th className="text-left px-6 py-3">Attendance</th>
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <Fragment key={`member-${member.member_id}`}>

              {/* Section Header */}
              {member.show_section_header && (
                <tr className="bg-navy/5 border-t border-navy/10">
                  <td
                    colSpan={4}
                    className="px-6 py-2 text-xs font-semibold uppercase tracking-wide text-navy"
                  >
                    {member.section_label ?? "Other"}
                  </td>
                </tr>
              )}

              {/* Instrument Header */}
              {member.show_instrument_header && (
                <tr className="bg-ivory">
                  <td
                    colSpan={4}
                    className="px-6 py-1 text-xs font-medium uppercase text-navy/70"
                  >
                    {member.instrument_label ?? "Other"}
                  </td>
                </tr>
              )}

              {/* Member Row */}
              <tr
                onClick={() => setSelectedMember(member.member_id)}
                className="border-b border-navy/10 hover:bg-ivory/70 transition cursor-pointer"
              >
                <td className="px-6 py-3">
                  <div className="font-medium text-midnight">
                    {member.display_name}
                  </div>
                  <div className="text-xs text-navy truncate">
                    {member.email}
                  </div>
                </td>

                <td className="px-6 py-3 text-midnight">
                  {member.instrument ?? "—"}
                </td>

                <td className="px-6 py-3 capitalize text-midnight">
                  {member.role ?? "—"}
                </td>

                <td className="px-6 py-3 text-midnight">
                  {member.attendance_requirement !== null
                    ? `${member.attendance_requirement}%`
                    : "—"}
                </td>
              </tr>

            </Fragment>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      <>
        {selectedMember && (
          <MemberDetailModal
            memberId={selectedMember}
            instruments={instruments}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </>
    </div>
  );
}