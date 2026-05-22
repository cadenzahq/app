"use client";

import { useState, useTransition } from "react";
import { upsertRSVP } from "@/actions/member/upsertRSVP";

export default function RSVPSection({
  eventId,
  orchestraId,
  currentStatus,
}: {
  eventId: string;
  orchestraId: string;
  currentStatus: "yes" | "no" | "maybe" | "pending" | null;
}) {
  const [isPending, startTransition] = useTransition();

  // 🔷 LOCAL STATE (TOP OF COMPONENT)
  const [status, setStatus] = useState<
    "yes" | "no" | "maybe" | "pending" | null
  >(currentStatus);

  const [error, setError] = useState<string | null>(null);

  // 🔷 ACTION HANDLER (DEFINED AFTER STATE)
  function handleRSVP(nextStatus: "yes" | "no" | "maybe") {
    startTransition(async () => {
      setError(null);

      const result = await upsertRSVP(
        orchestraId,
        eventId,
        nextStatus
      );

      if (!result.success) {
        setError(result.error);
        return;
      }

      // ✅ update UI only on success
      setStatus(nextStatus);
    });
  }

  return (
    <div className="bg-navy rounded-2xl p-6 shadow">
      <h2 className="text-lg text-ivory font-medium mb-4">
        Your RSVP
      </h2>

      {/* 🔴 ERROR UI — ALWAYS ABOVE BUTTONS */}
      {error && (
        <div className="text-sm text-red-600 mb-3">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <RSVPButton
          label="Yes"
          active={status === "yes"}
          color="gold"
          onClick={() => handleRSVP("yes")}
          disabled={isPending}
        />

        <RSVPButton
          label="Maybe"
          active={status === "maybe"}
          color="navy"
          onClick={() => handleRSVP("maybe")}
          disabled={isPending}
        />

        <RSVPButton
          label="No"
          active={status === "no"}
          color="gray"
          onClick={() => handleRSVP("no")}
          disabled={isPending}
        />
      </div>

      {isPending && (
        <div className="text-sm text-ivory/60 mt-3">
          Updating...
        </div>
      )}
    </div>
  );
}

function RSVPButton({
  label,
  active,
  color,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  color: "gold" | "navy" | "gray";
  onClick: () => void;
  disabled?: boolean;
}) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-medium transition";

  const styles = {
    gold: active
      ? "bg-gold text-midnight"
      : "bg-gold/20 text-gold hover:bg-gold/30",
    navy: active
      ? "bg-ivory text-midnight"
      : "bg-ivory/10 text-ivory hover:bg-ivory/20",
    gray: active
      ? "bg-gray-600 text-white"
      : "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={active || disabled}
      className={`${base} ${styles[color]}`}
    >
      {label}
    </button>
  );
}