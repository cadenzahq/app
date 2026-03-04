"use client";

import { useState, useTransition } from "react";
import { updateAttendanceAction } from "@/app/events/actions";

export default function RSVPForm({
  eventId,
  memberId,
  initialStatus
}: any) {

  const [status, setStatus] = useState(initialStatus);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSave() {

    const formData = new FormData();
    formData.append("member_id", memberId);
    formData.append("status", status);

    startTransition(async () => {

      await updateAttendanceAction(eventId, formData);

      setSaved(true);

      setTimeout(() => setSaved(false), 2000);

    });

  }

  return (

    <div>

      <label style={{ display: "block", marginBottom: "6px" }}>
        Your status
      </label>

      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
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
        disabled={isPending}
        style={buttonStyle}
      >
        {isPending ? "Saving..." : saved ? "Saved ✓" : "Save"}
      </button>

    </div>

  );

}

const selectStyle = {
  display: "block",
  padding: "8px",
  marginBottom: "12px",
  width: "100%"
};

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500"
};