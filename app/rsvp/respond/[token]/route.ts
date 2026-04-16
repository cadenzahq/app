import { createServiceClient } from "@/lib/supabase/service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  if (!status || !["yes", "maybe", "no"].includes(status)) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/rsvp/token/${token}`
    );
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("rsvps")
    .update({
      status,
      responded_at: new Date().toISOString(),
    })
    .eq("token", token)
    .select()
    .single();

  if (error) {
    console.error("RSVP update failed:", error);
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/rsvp/token/${token}`
  );
}