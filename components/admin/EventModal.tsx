"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";

import {
  utcToLocalInput,
  localInputToUTC,
  addHours,
} from "@/lib/utils/datetime";

type Props = {
  event: Event | null;
  onClose: () => void;
  onSaved: (event: Event) => void;
};

export default function EventModal({
  event,
  orchestraId,
  onClose,
  onSaved,
}: {
  event: Event | null;
  orchestraId: string;
  onClose: () => void;
  onSaved: (event: Event) => void;
}) {

  const supabase = createClient();
  const isEdit = !!event;

  // form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // ui state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");


  /**
   * Sync form state when modal opens or event changes
   * Prevents stale state and timezone bugs
   */
  useEffect(() => {

    if (event) {

      const localStart = utcToLocalInput(event.start_time);
      const localEnd = utcToLocalInput(event.end_time);

      setName(event.name || "");
      setLocation(event.location || "");
      setStartTime(localStart);
      setEndTime(localEnd);

    } else {

      // creating new event → default start = now rounded, end = +2h
      const now = new Date();

      now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15);
      now.setSeconds(0);
      now.setMilliseconds(0);

      const localNow = utcToLocalInput(now.toISOString());

      setName("");
      setLocation("");
      setStartTime(localNow);
      setEndTime(addHours(localNow, 2));
    }

    setError("");

  }, [event]);


  /**
   * Save handler
   */
  async function handleSave() {

    if (!name.trim()) {
      setError("Event name is required");
      return;
    }

    if (!startTime || !endTime) {
      setError("Start and end times are required");
      return;
    }

    if (endTime <= startTime) {
      setError("End time must be after start time");
      return;
    }

    setSaving(true);
    setError("");

    let result;

    if (isEdit) {

      result = await supabase
        .from("events")
        .update({
          name,
          location,
          start_time: localInputToUTC(startTime),
          end_time: localInputToUTC(endTime),
        })
        .eq("id", event!.id)
        .select()
        .single();

    } else {

      result = await supabase
        .from("events")
        .insert({
          name,
          location,
          start_time: localInputToUTC(startTime),
          end_time: localInputToUTC(endTime),
          orchestra_id: orchestraId,
        })
        .select()
        .single();
    }


    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }


    onSaved(result.data);
    onClose();
  }


  /**
   * Auto-adjust end time when start changes (create mode only)
   */
  function handleStartChange(value: string) {

    setStartTime(value);

    if (!isEdit) {
      setEndTime(addHours(value, 2));
    }
  }


  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">

        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Event" : "Create Event"}
        </h2>


        {error && (
          <div className="text-red-600 text-sm mb-3">
            {error}
          </div>
        )}


        <div className="space-y-3">

          <input
            className="w-full border rounded p-2"
            placeholder="Event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />


          <input
            type="datetime-local"
            className="w-full border rounded p-2"
            value={startTime}
            onChange={(e) => handleStartChange(e.target.value)}
          />


          <input
            type="datetime-local"
            className="w-full border rounded p-2"
            value={endTime}
            min={startTime}
            onChange={(e) => setEndTime(e.target.value)}
          />


          <input
            className="w-full border rounded p-2"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

        </div>


        <div className="flex justify-end gap-2 mt-6">

          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>


          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>

      </div>

    </div>
  );
}