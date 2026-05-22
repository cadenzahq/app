"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAnnouncement } from "../actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

export default function NewAnnouncementForm({
  orchestraId,
}: {
  orchestraId: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(
      e.currentTarget
    );

    try {
      const result =
        await createAnnouncement(
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
        message: "Announcement posted",
        type: "success",
      });

      setIsSubmitting(false);

      router.push(
        `/app/${orchestraId}/admin/announcements`
      );

    } catch (err) {
      console.error(
        "Announcement submit failed:",
        err
      );

      setError(
        "Unexpected error"
      );

      setIsSubmitting(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded">
          {error}
        </div>
      )}

      <input
        type="text"
        name="title"
        placeholder="Title"
        required
        className="w-full border border-navy/20 rounded-md p-3"
      />

      <textarea
        name="content"
        required
        rows={5}
        placeholder="Write announcement..."
        className="w-full border border-navy/20 rounded-md p-3"
      />

      <div className="flex justify-end gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() =>
            router.push(
              `/app/${orchestraId}/admin/announcements`
            )
          }
          className="px-4 py-2 bg-ivory border border-navy/20 rounded text-midnight disabled:opacity-50"
        >
          Cancel
        </button>

        <Button
          type="submit"
          loading={isSubmitting}
        >
          Post Announcement
        </Button>
      </div>
    </form>
  );
}