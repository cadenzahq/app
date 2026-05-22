"use server";

import { createClient } from "@/lib/supabase/server";
import { ok, fail, type ActionResult } from "@/lib/actions";

/*
CREATE MEMBER
*/
export async function createMember(
  orchestraId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const displayName =
      `${formData.get("first_name") ?? ""} ${formData.get("last_name") ?? ""}`.trim();

    const email =
      formData.get("email")?.toString().trim() || null;

    const phone =
      formData.get("phone")?.toString().trim() || null;

    const instrumentId =
      formData.get("instrument_id")?.toString();

    const attendanceRequirement =
      formData.get("attendance_requirement")
        ?.toString() || null;

    if (!displayName) {
      return fail("Name is required");
    }

    if (!instrumentId) {
      return fail("Instrument required");
    }

    const { error } = await supabase
      .from("members")
      .insert({
        orchestra_id: orchestraId,
        display_name: displayName,
        email,
        phone,
        attendance_requirement:
          attendanceRequirement
            ? Number(
                attendanceRequirement
              )
            : null,
        role: "member",
        is_active: true,
      });

    if (error) {
      console.error(error);
      return fail(error.message);
    }

    return ok();

  } catch (err) {
    console.error(
      "createMember crash:",
      err
    );

    return fail(
      "Unexpected error"
    );
  }
}

/*
UPDATE MEMBER
*/
export async function updateMember(
  memberId: string,
  orchestraId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const displayName =
      formData
        .get("display_name")
        ?.toString()
        .trim();

    const email =
      formData
        .get("email")
        ?.toString()
        .trim() || null;

    const phone =
      formData
        .get("phone")
        ?.toString()
        .trim() || null;

    const instrumentId =
      formData
        .get("instrument_id")
        ?.toString() || null;

    const attendanceRequirement =
      formData
        .get("attendance_requirement")
        ?.toString() || null;

    if (!displayName) {
      return fail("Name required");
    }

    /*
      Update members table
    */

    const { error: memberError } =
      await supabase
        .from("members")
        .update({
          display_name: displayName,
          email,
          phone,
          attendance_requirement:
            attendanceRequirement
              ? Number(
                  attendanceRequirement
                )
              : null,
        })
        .eq("id", memberId)
        .eq(
          "orchestra_id",
          orchestraId
        );

    if (memberError) {
      console.error(memberError);

      return fail(
        memberError.message
      );
    }

    /*
      Update member_instruments
    */

    if (instrumentId) {
      await supabase
        .from(
          "member_instruments"
        )
        .delete()
        .eq(
          "member_id",
          memberId
        );

      const {
        error:
          instrumentError,
      } = await supabase
        .from(
          "member_instruments"
        )
        .insert({
          member_id:
            memberId,
          instrument_id:
            instrumentId,
          is_primary: true,
        });

      if (
        instrumentError
      ) {
        console.error(
          instrumentError
        );

        return fail(
          "Failed to update instrument"
        );
      }
    }

    return ok();

  } catch (err) {
    console.error(
      "updateMember crash:",
      err
    );

    return fail(
      "Unexpected error"
    );
  }
}

/*
DEACTIVATE MEMBER
*/
export async function deactivateMember(
  memberId: string,
  orchestraId: string
): Promise<ActionResult> {
  try {
    const supabase =
      await createClient();

    const { error } =
      await supabase
        .from("members")
        .update({
          is_active: false,
        })
        .eq("id", memberId)
        .eq(
          "orchestra_id",
          orchestraId
        );

    if (error) {
      console.error(error);

      return fail(
        error.message
      );
    }

    return ok();

  } catch (err) {
    console.error(
      "deactivateMember crash:",
      err
    );

    return fail(
      "Unexpected error"
    );
  }
}