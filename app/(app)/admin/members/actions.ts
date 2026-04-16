"use server";

import { createClient } from "@/lib/supabase/server";
import { getActiveOrchestraForUser } from "@/lib/orchestra";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMember(formData: FormData) {
  const supabase = await createClient();
  const orchestra = await getActiveOrchestraForUser(supabase);

  if (!orchestra) {
    throw new Error("No orchestra found");
  }

  // Required fields
  const firstName = formData.get("first_name")?.toString().trim();
  const lastName = formData.get("last_name")?.toString().trim();
  const instrumentId = formData.get("instrument_id")?.toString();

  if (!firstName || !lastName) {
    throw new Error("Missing name");
  }

  if (!instrumentId) {
    throw new Error("Instrument is required");
  }

  const displayName = `${firstName} ${lastName}`;

  // Optional fields
  const email = formData.get("email")?.toString() || null;
  const phone = formData.get("phone")?.toString() || null;

  // Attendance handling
  const attendanceRaw = formData.get("attendance_requirement");
  const attendanceRequirement =
    attendanceRaw && attendanceRaw.toString().trim() !== ""
      ? Number(attendanceRaw)
      : null;

  // Insert member
  const { data: member, error } = await supabase
    .from("members")
    .insert({
      orchestra_id: orchestra.id,
      display_name: displayName,
      email,
      phone,
      attendance_requirement: attendanceRequirement,
      is_active: true,
    })
    .select()
    .single();

  if (error || !member) {
    console.error("Create member error:", error);
    throw new Error("Failed to create member");
  }

  // Insert primary instrument
  const { error: instError } = await supabase
    .from("member_instruments")
    .insert({
      member_id: member.id,
      instrument_id: instrumentId,
      is_primary: true,
    });

  if (instError) {
    console.error("Instrument insert error:", instError);
    throw new Error("Failed to assign instrument");
  }

  revalidatePath("/admin/members");
  redirect("/admin/members");
}

export async function updateMember(memberId: string, formData: FormData) {
    const supabase = await createClient();

    const display_name = formData.get("display_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const role = formData.get("role") as string;
    const attendance_requirement =
    Number(formData.get("attendance_requirement")) || null;

    const instrument_id = formData.get("instrument_id") as string;

    if (!instrument_id) {
        throw new Error("Instrument is required");
    }

    // Update members table
    await supabase
    .from("members")
    .update({
        display_name,
        email,
        phone,
        role,
        attendance_requirement,
    })
    .eq("id", memberId);

    // 1. Check if this instrument already exists for the member
    const { data: existing } = await supabase
    .from("member_instruments")
    .select("id")
    .eq("member_id", memberId)
    .eq("instrument_id", instrument_id)
    .maybeSingle();

    if (existing) {
    // Instrument already exists → just switch primary

    // clear current primary
    await supabase
        .from("member_instruments")
        .update({ is_primary: false })
        .eq("member_id", memberId);

    // set this one as primary
    await supabase
        .from("member_instruments")
        .update({ is_primary: true })
        .eq("id", existing.id);

    } else {
    // New instrument → normal flow

    await supabase
        .from("member_instruments")
        .update({ is_primary: false })
        .eq("member_id", memberId);

    await supabase
        .from("member_instruments")
        .insert({
        member_id: memberId,
        instrument_id,
        is_primary: true,
        });
    }

    // check for multiple primaries
    const { data: primaries } = await supabase
        .from("member_instruments")
        .select("id")
        .eq("member_id", memberId)
        .eq("is_primary", true);

    if (primaries && primaries.length > 1) {
        console.error("Multiple primary instruments detected");
    }

  revalidatePath("/admin/members");
}

export async function inactivateMember(memberId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("members")
    .update({ is_active: false })
    .eq("id", memberId);

  if (error) {
    console.error("Inactivate error:", error);
    throw error;
  }

  revalidatePath("/admin/members");
}