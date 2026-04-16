import AttendanceRow from "@/components/admin/AttendanceRow"
import React from "react"

type Member = {
  member_id: string
  full_name: string
  instrument: string | null
  instrument_sort_order: number
  section: string
  section_sort_order: number
  attendance_status: string
}

type Props = {
  groupedMembers: [string, Member[]][]
  action: (formData: FormData) => Promise<void>
  isLocked: boolean
}

export default function AttendanceTable({ groupedMembers, action, isLocked }: Props) {

  return (
    <div>

      <table className="w-full text-sm">

        <thead>
          <tr className="border-b">
            <th className="text-left py-2 w-[30%]">Name</th>
            <th className="text-left py-2 w-[20%]">Instrument</th>
            <th className="text-left py-2 w-[30%]">Status</th>
          </tr>
        </thead>

        <tbody>

          {groupedMembers.map(([section, members]) => (
            <React.Fragment key={section}>

              {/* Section header */}
              <tr className="sticky top-0 bg-gray-100 border-t z-10">
                <td colSpan={3} className="py-2 font-semibold">
                  {section} ({members.length})
                </td>
              </tr>

              {/* Members */}
              {members.map(member => (
                <AttendanceRow
                  key={member.member_id}
                  memberId={member.member_id}
                  memberName={member.full_name}
                  instrument={member.instrument}
                  initialStatus={member.attendance_status}
                  action={action}
                  isLocked={isLocked}
                />
              ))}

            </React.Fragment>
          ))}

        </tbody>

      </table>

    </div>
  )
}