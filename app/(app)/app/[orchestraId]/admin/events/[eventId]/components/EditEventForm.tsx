"use client";

import { useEffect, useState } from "react";
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/app/(app)/app/[orchestraId]/admin/events/actions";

import { createSeason } from "@/actions/admin/seasons";
import { createSeries } from "@/actions/admin/series";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/ToastProvider";
import { utcToLocalInput } from "@/lib/utils/datetime";

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

export default function EditEventForm({
  event,
  seasons,
  orchestraId,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();

  const isEditMode = !!event;

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [selectedSeasonId, setSelectedSeasonId] =
    useState<string | null>(
      event?.season_id ?? null
    );

  const [selectedSeriesId, setSelectedSeriesId] =
    useState<string | null>(
      event?.series_id ?? null
    );

  const [seriesOptions, setSeriesOptions] =
    useState<Series[]>([]);

  const [seasonOptions, setSeasonOptions] =
    useState(seasons);

  const [showSeasonModal, setShowSeasonModal] =
    useState(false);

  const [showSeriesModal, setShowSeriesModal] =
    useState(false);

  const [newSeasonName, setNewSeasonName] =
    useState("");

  const [newSeriesName, setNewSeriesName] =
    useState("");

  useEffect(() => {
    if (!selectedSeasonId) {
      setSeriesOptions([]);
      return;
    }

    async function fetchSeries() {
      const { data } = await supabase
        .from("event_series")
        .select("id,name")
        .eq(
          "season_id",
          selectedSeasonId
        )
        .order("name");

      setSeriesOptions(data ?? []);
    }

    fetchSeries();
  }, [selectedSeasonId, supabase]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    const formData =
      new FormData(e.currentTarget);

    const result = isEditMode
      ? await updateEvent(
          event!.id,
          orchestraId,
          formData
        )
      : await createEvent(
          orchestraId,
          formData
        );

    if (!result.success) {
      setError(
        result.error ??
          "Something went wrong"
      );

      setIsSubmitting(false);

      return;
    }

    showToast({
      message: isEditMode
        ? "Event updated"
        : "Event created",
      type: "success",
    });

    router.push(
      `/app/${orchestraId}/admin/events`
    );
  }

  async function handleDelete() {
    if (!event) return;

    const result =
      await deleteEvent(
        event.id,
        orchestraId
      );

    if (!result.success) {
      setError(result.error);

      return;
    }

    showToast({
      message: "Event deleted",
      type: "success",
    });

    router.push(
      `/app/${orchestraId}/admin/events`
    );
  }

  async function handleCreateSeason() {
    const season =
      await createSeason({
        name: newSeasonName,
        orchestraId,
        is_current: false,
      });

    if (!season) return;

    setSeasonOptions((prev) => [
      ...prev,
      season,
    ]);

    setSelectedSeasonId(
      season.id
    );

    setShowSeasonModal(false);

    setNewSeasonName("");

    showToast({
      message:
        "Season created",
      type: "success",
    });
  }

  async function handleCreateSeries() {
    if (!selectedSeasonId) return;

    const series =
      await createSeries({
        name: newSeriesName,
        season_id:
          selectedSeasonId,
        orchestraId,
      });

    if (!series) return;

    setSeriesOptions((prev) => [
      ...prev,
      series,
    ]);

    setSelectedSeriesId(
      series.id
    );

    setShowSeriesModal(false);

    setNewSeriesName("");

    showToast({
      message:
        "Series created",
      type: "success",
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-4">

      <h1 className="text-2xl font-semibold text-midnight mb-6">
        {isEditMode
          ? "Edit Event"
          : "Create Event"}
      </h1>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        <div>
          <label className="block text-sm font-medium mb-1">
            Event Name
          </label>

          <input
            name="name"
            required
            defaultValue={event?.name ?? ""}
            placeholder="Rehearsal 1"
            className="w-full border border-navy/20 rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Event Type
          </label>

          <input
            name="event_type"
            defaultValue={event?.event_type ?? ""}
            placeholder="Rehearsal, Concert..."
            className="w-full border border-navy/20 rounded-md p-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div>
            <label className="block text-sm font-medium mb-1">
              Start Time
            </label>

            <input
              type="datetime-local"
              name="start_time"
              required
              defaultValue={
                event?.start_time
                  ? utcToLocalInput(
                      event.start_time
                    )
                  : ""
              }
              className="w-full border border-navy/20 rounded-md p-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              End Time
            </label>

            <input
              type="datetime-local"
              name="end_time"
              defaultValue={
                event?.end_time
                  ? utcToLocalInput(
                      event.end_time
                    )
                  : ""
              }
              className="w-full border border-navy/20 rounded-md p-3"
            />
          </div>

        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Location
          </label>

          <input
            name="location"
            defaultValue={event?.location ?? ""}
            placeholder="Main Hall"
            className="w-full border border-navy/20 rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>

          <textarea
            name="description"
            defaultValue={event?.description ?? ""}
            placeholder="Optional description"
            className="w-full border border-navy/20 rounded-md p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Notes
          </label>

          <textarea
            name="notes"
            defaultValue={event?.notes ?? ""}
            placeholder="Internal admin notes"
            className="w-full min-h-[100px] border border-navy/20 rounded-md p-3"
          />
        </div>

        <div>

          <div className="flex justify-between mb-1">

            <label className="text-sm font-medium">
              Season
            </label>

            <button
              type="button"
              onClick={() =>
                setShowSeasonModal(
                  true
                )
              }
              className="text-sm text-gold hover:underline"
            >
              + Create Season
            </button>

          </div>

          <select
            value={selectedSeasonId ?? ""}
            onChange={(e) => {
              const val =
                e.target.value || null;

              setSelectedSeasonId(val);

              setSelectedSeriesId(null);
            }}
            required
            className="w-full border border-navy/20 rounded-md p-3"
          >
            <option value="">
              Select season
            </option>

            {seasonOptions.map(
              (season) => (
                <option
                  key={season.id}
                  value={season.id}
                >
                  {season.name}
                </option>
              )
            )}
          </select>

        </div>

        <div>

          <div className="flex justify-between mb-1">

            <label className="text-sm font-medium">
              Series
            </label>

            <button
              type="button"
              disabled={!selectedSeasonId}
              onClick={() =>
                setShowSeriesModal(
                  true
                )
              }
              className="text-sm text-gold hover:underline disabled:text-gray-400"
            >
              + Create Series
            </button>

          </div>

          <select
            name="series_id"
            value={selectedSeriesId ?? ""}
            onChange={(e) =>
              setSelectedSeriesId(
                e.target.value
              )
            }
            disabled={!selectedSeasonId}
            className="w-full border border-navy/20 rounded-md p-3"
          >
            <option value="">
              Select series
            </option>

            {seriesOptions.map(
              (series) => (
                <option
                  key={series.id}
                  value={series.id}
                >
                  {series.name}
                </option>
              )
            )}
          </select>

        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              router.push(
                `/app/${orchestraId}/admin/events`
              )
            }
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
          >
            {isEditMode
              ? "Update Event"
              : "Create Event"}
          </Button>

        </div>

      </form>

      {showSeasonModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4">
              Create Season
            </h2>

            <input
              value={newSeasonName}
              onChange={(e) =>
                setNewSeasonName(
                  e.target.value
                )
              }
              placeholder="2026–2027 Season"
              className="w-full border rounded p-3"
            />

            <div className="flex justify-end gap-2 mt-4">

              <Button
                variant="outline"
                onClick={() =>
                  setShowSeasonModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateSeason}
              >
                Create
              </Button>

            </div>

          </div>
        </div>
      )}

      {showSeriesModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h2 className="text-xl font-semibold mb-4">
              Create Series
            </h2>

            <input
              value={newSeriesName}
              onChange={(e) =>
                setNewSeriesName(
                  e.target.value
                )
              }
              placeholder="Spring Concert"
              className="w-full border rounded p-3"
            />

            <div className="flex justify-end gap-2 mt-4">

              <Button
                variant="outline"
                onClick={() =>
                  setShowSeriesModal(false)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateSeries}
              >
                Create
              </Button>

            </div>

          </div>
        </div>
      )}

      {isEditMode && (
        <div className="mt-8">

          <Button
            variant="destructive"
            onClick={() =>
              setShowDeleteConfirm(true)
            }
          >
            Delete Event
          </Button>

          {showDeleteConfirm && (
            <div className="mt-4">

              <p className="text-red-600 text-sm mb-2">
                Are you sure?
              </p>

              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Confirm Delete
              </Button>

            </div>
          )}

        </div>
      )}

    </div>
  );
}