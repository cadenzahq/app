"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateMember, deactivateMember } from "./actions";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";
import { useRouter } from "next/navigation";

type Instrument = {
  id: string;
  name: string;
};

type MemberData = {
  member_id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  attendance_requirement: number | null;

  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;

  instruments:
    | {
        instrument_id: string | null;
        instrument: string | null;
      }[]
    | null;
};

export default function MemberDetailModal({
  memberId,
  orchestraId,
  instruments,
  onClose,
}: {
  memberId: string;
  orchestraId: string;
  instruments: Instrument[];
  onClose: () => void;
}) {
  const supabase = useState(
    () => createClient()
  )[0];

  const router = useRouter();

  const [member, setMember] =
    useState<MemberData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      const { data, error } =
        await supabase
          .from("admin_member_detail_view")
          .select("*")
          .eq("member_id", memberId)
          .maybeSingle();

      if (error) {
        console.error(
          "Member load error:",
          error
        );
        return;
      }

      setMember(data);
      setLoading(false);
    }

    load();
  }, [memberId, supabase]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formData = new FormData(
      e.currentTarget
    );

    const result =
      await updateMember(
        memberId,
        orchestraId,
        formData
      );

    if (!result.success) {
      showToast({
        message:
          result.error ??
          "Update failed",
        type: "error",
      });

      return;
    }

    showToast({
      message: "Member updated",
      type: "success",
    });

    router.refresh();
    onClose();
  }

  async function handleDeactivate() {
    const result =
      await deactivateMember(
        memberId,
        orchestraId
      );

    if (!result.success) {
      showToast({
        message:
          result.error ??
          "Remove failed",
        type: "error",
      });

      return;
    }

    showToast({
      message: "Member removed",
      type: "success",
    });

    router.refresh();
    onClose();
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        Loading...
      </div>
    );
  }

  if (!member) return null;

  const currentInstrumentId =
    member.instruments?.[0]
      ?.instrument_id ?? "";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-xl">

        <h2 className="text-xl font-semibold text-midnight mb-6">
          Edit Member
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="display_name"
            defaultValue={
              member.display_name
            }
            placeholder="Full name"
            className="w-full border border-navy/20 rounded p-3"
          />

          <input
            name="email"
            defaultValue={
              member.email ?? ""
            }
            placeholder="Email"
            className="w-full border border-navy/20 rounded p-3"
          />

          <input
            name="phone"
            defaultValue={
              member.phone ?? ""
            }
            placeholder="Phone number"
            className="w-full border border-navy/20 rounded p-3"
          />

          <select
            name="instrument_id"
            defaultValue={
              currentInstrumentId
            }
            className="w-full border border-navy/20 rounded p-3"
          >
            <option value="">
              Select instrument
            </option>

            {instruments.map((inst) => (
              <option
                key={inst.id}
                value={inst.id}
              >
                {inst.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="attendance_requirement"
            defaultValue={
              member.attendance_requirement ??
              ""
            }
            placeholder="Attendance requirement %"
            className="w-full border border-navy/20 rounded p-3"
          />

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={
                handleDeactivate
              }
            >
              Remove
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button type="submit">
                Save
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}