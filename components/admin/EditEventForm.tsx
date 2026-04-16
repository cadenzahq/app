"use client";

import { useEffect, useState } from "react";
import { createEvent, updateEvent, deleteEvent } from "@/app/(app)/admin/events/actions";
import { createSeason } from "@/actions/admin/seasons";
import { createSeries } from "@/actions/admin/series";
import { Button } from "@/components/ui/Button";
import { DeleteSubmitButton } from "./DeleteButton";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Event = {
  id: string;
  name: string;
  event_type: string | null;
  start_time: string;
  end_time: string | null;
  location: string | null;
  description: string | null;
  notes: string | null;
  series_id: string | null;
  season_id: string;
};

type Series = {
  id: string;
  name: string;
};

type Season = {
  id: string;
  name: string;
};

interface Props {
  event: Event | null;
  seasons: Season[];
  orchestraId: string;
}

export default function EditEventForm({ event, seasons, orchestraId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const isEditMode = !!event;

  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(
    event?.season_id ?? null
  );

  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(
    event?.series_id ?? null
  );
  const [seasonOptions, setSeasonOptions] = useState(seasons);
  const [seriesOptions, setSeriesOptions] = useState<Series[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch series when season changes
  useEffect(() => {
    if (!selectedSeasonId) {
      setSeriesOptions([]);
      return;
    }

    const fetchSeries = async () => {
      const { data } = await supabase
        .from("event_series")
        .select("id, name")
        .eq("season_id", selectedSeasonId)
        .order("name");

      setSeriesOptions(data ?? []);
    };

    fetchSeries();
  }, [selectedSeasonId]);

  const formAction = isEditMode
    ? updateEvent.bind(null, event.id)
    : createEvent;

  const deleteAction = isEditMode
    ? deleteEvent.bind(null, event.id)
    : null;

  return (
    <div className="max-w-2xl mx-auto px-6 py-4">

      {/* Header */}
      <h1 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Event" : "Create Event"}
      </h1>

      <form action={formAction} className="space-y-3">

        {/* Event Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Event Name</label>
          <input
            name="name"
            defaultValue={event?.name ?? ""}
            className="w-full border rounded-md p-3"
            required
          />
        </div>

        {/* Event Type */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Event Type</label>
          <input
            name="event_type"
            defaultValue={event?.event_type ?? ""}
            className="w-full border rounded-md p-3"
          />
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-3">
          {/* Start Time */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              defaultValue={event?.start_time?.slice(0, 16) ?? ""}
              className="border rounded-md p-3 w-full"
              required
            />
          </div>

          {/* End Time */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              End Time
            </label>
            <input
              type="datetime-local"
              name="end_time"
              defaultValue={event?.end_time?.slice(0, 16) ?? ""}
              className="border rounded-md p-3 w-full"
            />
          </div>
        </div>

        {/* Location */}
        <label className="text-sm font-medium text-gray-600">Location</label>
        <input
          name="location"
          defaultValue={event?.location ?? ""}
          className="w-full border rounded-md p-3"
        />

        {/* Description */}
        <label className="text-sm font-medium text-gray-600">Description</label>
        <textarea
          name="description"
          defaultValue={event?.description ?? ""}
          className="w-full border rounded-md p-3"
        />

         {/* Notes */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">Notes</label>
          <textarea
            name="notes"
            defaultValue={event?.notes ?? ""}
            className="w-full min-h-[100px] rounded-md border px-3 py-2"
          />
        </div>

        {/* Season */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">Season</label>

            {!isEditMode && (
              <button
                type="button"
                onClick={async () => {
                  const name = prompt("Enter new season name (e.g. 2026–2027)");
                  if (!name) return;

                  const newSeason = await createSeason({
                    name,
                    orchestra_id: orchestraId,
                  });

                  setSeasonOptions((prev) => [...prev, newSeason]);
                  setSelectedSeasonId(newSeason.id);
                }}
                className="text-sm text-purple-600 hover:underline"
              >
                + Create
              </button>
            )}
          </div>

          <select
            value={selectedSeasonId ?? ""}
            onChange={(e) => {
              const seasonId = e.target.value || null;
              setSelectedSeasonId(seasonId);
              setSelectedSeriesId(null);
            }}
            className="w-full border rounded-md p-3"
            required
          >
            <option value="">Select season</option>
            {seasonOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Series */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">
              Series
            </label>

            {!isEditMode && selectedSeasonId && (
              <button
                type="button"
                onClick={async () => {
                  const name = prompt("Enter series name");
                  if (!name) return;

                  const newSeries = await createSeries({
                    name,
                    season_id: selectedSeasonId,
                    orchestra_id: orchestraId,
                  });

                  setSeriesOptions((prev) => [...prev, newSeries]);
                  setSelectedSeriesId(newSeries.id);
                }}
                className="text-sm text-purple-600 hover:underline"
              >
                + Create
              </button>
            )}
          </div>

          <select
            name="series_id"
            value={selectedSeriesId ?? ""}
            onChange={(e) => setSelectedSeriesId(e.target.value)}
            disabled={!selectedSeasonId}
            className="w-full border rounded-md p-3"
          >
            <option value="">
              {selectedSeasonId
                ? "Select series"
                : "Select season first"}
            </option>

            {seriesOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/events")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? "Update Event" : "Create Event"}
          </Button>
        </div>

      </form>

      {/* Delete */}
      {isEditMode && (
        <div className="mt-6">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Event
          </Button>

          {showDeleteConfirm && (
            <form action={deleteAction!} className="mt-4">
              <DeleteSubmitButton />
            </form>
          )}
        </div>
      )}
    </div>
  );
}