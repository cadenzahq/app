"use client";

import { useState } from "react";
import { updateEvent, deleteEvent } from "@/app/(app)/admin/events/actions";
import { Button } from "@/components/ui/Button";
import { DeleteSubmitButton } from "./DeleteButton";

interface Props {
  event: any;
  series: { id: string; name: string; season_id: string | null }[];
  seasons: { id: string; name: string }[];
}

export default function EditEventForm({ event, series, seasons }: Props) {

  const updateAction = updateEvent.bind(null, event.id);
  const deleteAction = deleteEvent.bind(null, event.id);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const selectedSeries = series.find(s => s.id === event.series_id);
  const seasonName =
    seasons.find(s => s.id === selectedSeries?.season_id)?.name ?? "None";

  return (
    <>
      <form action={updateAction} className="space-y-5">

        {/* Event Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Event Name
          </label>
          <input
            name="name"
            defaultValue={event.name}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Event Type */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Event Type
          </label>
          <input
            name="event_type"
            defaultValue={event.event_type}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Times */}
        <div className="grid grid-cols-2 gap-3">

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              defaultValue={event.start_time?.slice(0,16)}
              className="w-full border rounded-md p-3 focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">
              End Time
            </label>
            <input
              type="datetime-local"
              name="end_time"
              defaultValue={event.end_time?.slice(0,16) ?? ""}
              className="w-full border rounded-md p-3 focus:ring-2 focus:ring-purple-500"
            />
          </div>

        </div>

        {/* Location */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Location
          </label>
          <input
            name="location"
            defaultValue={event.location ?? ""}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={event.description ?? ""}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Season (derived) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-600">
            Season
          </label>
          <div className="border rounded-md p-3 bg-gray-50">
            {seasonName}
          </div>
        </div>

        {/* Series */}
        <div className="space-y-1">

          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">
              Series
            </label>

            <button
              type="button"
              className="text-sm text-purple-600 hover:underline"
            >
              + Create
            </button>
          </div>

          <select
            name="series_id"
            defaultValue={event.series_id ?? ""}
            className="w-full border rounded-md p-3"
          >
            <option value="">Select series (optional)</option>

            {series.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}

          </select>

        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button type="button" variant="outline">
            Cancel
          </Button>

          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>

      </form>

      {/* Delete Section */}

      <div className="border-t pt-6 mt-6">

        {!showDeleteConfirm && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Event
          </Button>
        )}

        {showDeleteConfirm && (

          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4 space-y-4">

            <p className="text-sm text-gray-700">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>

            <div className="flex gap-3">

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>

              <form action={deleteAction}>
                <DeleteSubmitButton />
              </form>

            </div>

          </div>

        )}

      </div>
    </>
  );
}