import Image from "next/image";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase/admin";

import Hero from "@/components/marketing/Hero";
import ProblemCards from "@/components/marketing/ProblemCards";
import FeatureSection from "@/components/marketing/FeatureSection";
import EarlyAccessSection from "@/components/marketing/EarlyAccessSection";

const resend = new Resend(process.env.RESEND_API_KEY);

async function joinWaitlist(formData: FormData) {
  "use server";

  const supabase = supabaseAdmin;

  const email = formData.get("email") as string;
  const company = formData.get("company");

  if (company) return;

  if (!email) return;

  if (!email.includes("@")) {
    redirect("/?error=invalid#early-access");
  }

  const { data, error } = await supabase
    .from("waitlist")
    .upsert(
      {
        email,
        created_at: new Date(),
      },
      {
        onConflict: "email",
      }
    );

  if (error) {
    console.error(
      "Waitlist insert failed:",
      error
    );
  } else {
    console.log(
      "Waitlist insert success:",
      data
    );
  }

  try {
    const emailResult =
      await resend.emails.send({
        from:
          "Cadenza Waitlist <info@cadenzahq.com>",

        to: ["james@cadenzahq.com"],

        subject:
          "New Cadenza Early Access Signup",

        html: `
          <p>
            <strong>${email}</strong>
            joined early access.
          </p>
        `,
      });

    console.log(
      "Resend result:",
      emailResult
    );
  } catch (err) {
    console.error(
      "Email notification failed",
      err
    );
  }

  redirect("/?joined=true#early-access");
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    joined?: string;
    error?: string;
  }>;
}) {
  const params =
    await searchParams;

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0F172A]/95 backdrop-blur">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <a
            href="/"
            className="flex items-center"
          >
            <Image
              src="/branding/Cadenza_2 Color Dark BG.svg"
              alt="Cadenza"
              width={150}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </a>

          <div className="flex items-center gap-5">

            <a
              href="/login"
              className="text-sm font-medium text-slate-200 transition hover:text-white"
            >
              Login
            </a>

            <a
              href="#early-access"
              className="rounded-xl bg-[#D4A44D] px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Early Access
            </a>

          </div>

        </div>

      </header>

      <Hero />

      <ProblemCards />

      <FeatureSection
        eyebrow="Attendance"
        title="Attendance musicians actually use"
        description="Get quick responses and reduce last-minute surprises with workflows designed for volunteer ensembles."
        bullets={[
          "Fast RSVP workflow",
          "Attendance tracking",
          "Clear response status",
        ]}
        image="/marketing/member-events.png"
      />

      <FeatureSection
        eyebrow="Dashboard"
        title="See your orchestra at a glance"
        description="Quickly understand upcoming events, announcements, and the actions that matter most."
        bullets={[
          "Upcoming events",
          "Announcements",
          "Action items",
        ]}
        image="/marketing/dashboard.png"
        reverse
      />

      <FeatureSection
        eyebrow="Members"
        title="Keep your ensemble organized"
        description="Manage members, roles, attendance, and participation without spreadsheet chaos."
        bullets={[
          "Roster management",
          "Attendance insights",
          "Member roles",
        ]}
        image="/marketing/roster.png"
      />

      <EarlyAccessSection
        joined={params?.joined}
        error={params?.error}
        action={joinWaitlist}
      />

      <footer className="bg-[#F8FAFC] py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Cadenza
      </footer>

    </main>
  );
}