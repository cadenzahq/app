"use client";

import { useState, useTransition } from "react";
import { sendEventReminder } from "@/actions/admin/dashboard";
import { Button } from "@/components/ui/Button";

interface Props {
  eventId: string;
  pendingCount: number;
  onSuccess: (message: string) => void;
}

export default function SendReminderButton({ eventId, pendingCount , onSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await sendEventReminder(eventId);

        if (result.success) {
            onSuccess(`RSVP reminder sent to ${result.count} members.`);
        }

      setIsOpen(false);
    });
  }

  return (
    <>
        <Button
        variant="outline"
        className="w-full"
        disabled={pendingCount === 0}
        onClick={() => setIsOpen(true)}
        >
        {pendingCount === 0
            ? "All Members Responded"
            : "Send Reminders"}
        </Button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="font-semibold text-lg">
              Send Reminder?
            </h2>
            <p className="text-sm text-gray-600">
              This will email all members who have not responded.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleConfirm}
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}