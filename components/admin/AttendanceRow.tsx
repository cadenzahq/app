"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AttendanceRow({
  eventId,
  memberId,
  orchestraId,
  initialStatus,
  memberName,
  instrument,
  action
}: any) {

  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

    function handleSave() {

      const formData = new FormData();
      formData.append("memberId", memberId);
      formData.append("status", status);

      setDirty(false);

      startTransition(async () => {

          await action(formData);

          setSaved(true);

          // Refresh server components AFTER save completes
          router.refresh();

          setTimeout(() => {
          setSaved(false);
          }, 2000);

      });

    }

  return (
    <tr>

      <td style={tdStyle}>{memberName}</td>

      <td style={tdStyle}>{instrument}</td>

      <td style={tdStyle}>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setDirty(true);
            setSaved(false);
          }}
          style={selectStyle}
        >
          <option>No Response</option>
          <option>Attending</option>
          <option>Maybe</option>
          <option>Absent</option>
        </select>

        <button
          onClick={handleSave}
          disabled={!dirty || isPending}
          style={{
            ...buttonStyle,
            opacity: (!dirty || isPending) ? 0.5 : 1
          }}
        >
          {isPending
            ? "Saving..."
            : saved
            ? "Saved ✓"
            : "Save"}
        </button>

      </td>

    </tr>
  );
}

const tdStyle = {
  padding: "8px"
};

const selectStyle = {
  padding: "4px",
  marginRight: "8px"
};

const buttonStyle = {
  padding: "4px 8px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#333",
  color: "white",
  cursor: "pointer"
};