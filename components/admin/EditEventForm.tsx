"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

interface Event {
  id: string;
  name: string;
  event_type: string;
  start_time: string;
  end_time: string;
  location: string | null;
  description: string | null;
  orchestra_id: string;
}

interface EventFormProps {
  event?: Event;              // optional for create mode
  orchestraId: string;        // required for create
}

export default function EditEventForm({
  event,
  orchestraId,
}: EventFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const isEditMode = !!event;

  const [name, setName] = useState(event?.name ?? "");
  const [eventType, setEventType] = useState(event?.event_type ?? "");
  const [startTime, setStartTime] = useState(
    event?.start_time?.slice(0, 16) ?? ""
  );
  const [endTime, setEndTime] = useState(
    event?.end_time?.slice(0, 16) ?? ""
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [description, setDescription] = useState(event?.description ?? "");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const payload = {
      name,
      event_type: eventType,
      start_time: startTime,
      end_time: endTime,
      location: location || null,
      description: description || null,
    };

    let error;

    if (isEditMode) {
      ({ error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", event!.id));
    } else {
      ({ error } = await supabase
        .from("events")
        .insert({
          ...payload,
          orchestra_id: orchestraId,
        }));
    }

    if (!error) {
      router.push("/admin/events");
    } else {
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="Event Name"
        required
      />

      <input
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="Event Type (rehearsal, concert, etc.)"
        required
      />

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full border p-3 rounded"
        required
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="Location"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-3 rounded"
        placeholder="Description"
      />

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="w-full"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
        >
          {isEditMode ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}