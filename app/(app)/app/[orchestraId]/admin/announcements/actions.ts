"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentMember } from "@/actions/shared/getCurrentMember";
import {
  ok,
  fail,
  type ActionResult,
} from "@/lib/actions";

export async function createAnnouncement(
  orchestraId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const member =
      await getCurrentMember(orchestraId);

    if (!member) {
      return fail("Not authenticated");
    }

    const content =
      formData
        .get("content")
        ?.toString()
        .trim();

    if (!content) {
      return fail(
        "Content is required"
      );
    }

    const title =
      formData
        .get("title")
        ?.toString()
        .trim() ||
      "Announcement";

    const { error } =
      await supabase
        .from("announcements")
        .insert({
          orchestra_id:
            orchestraId,
          content,
          title,
          created_by:
            member.member_id,
          is_pinned: false,
        });

    if (error) {
      console.error(error);

      return fail(
        "Failed to create announcement"
      );
    }

    return ok();

  } catch (err) {
    console.error(
      "createAnnouncement crash:",
      err
    );

    return fail(
      "Unexpected error"
    );
  }
}