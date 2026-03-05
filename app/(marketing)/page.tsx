import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function joinWaitlist(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const email = formData.get("email") as string;
  const company = formData.get("company");

  if (company) return; // bot submission
  if (!email) return;
  if (!email.includes("@")) {
    redirect("/?error=invalid#waitlist");
  }

  await supabase
    .from("waitlist")
    .upsert({ email, created_at: new Date() }, { onConflict: "email" })

  redirect("/?joined=true#waitlist");
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ joined?: string; error?: string }>;
}) {

  const params = await searchParams;

  return (
    <main className="min-h-screen text-slate-900">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">

        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3">

          <a
            href="/"
            className="font-semibold text-lg tracking-tight"
          >
            Cadenza
          </a>

          <a
            href="/login"
            className="text-sm px-4 py-1.5 rounded-md border border-slate-300 hover:bg-slate-100 transition"
          >
            Login
          </a>

        </div>

      </header>

      {/* HERO */}
      <section className="text-center pt-12 pb-12 px-6">

        <h1 className="text-[96px] md:text-[120px] font-bold tracking-tight">
          Cadenza
        </h1>

        <p className="mt-4 text-xl text-slate-600 max-w-xl mx-auto">
          Orchestra management software built for modern ensembles.
        </p>

        <p className="mt-2 text-slate-500">
          Rehearsals · Personnel · Music · Communication
        </p>

        <div className="mt-6 flex justify-center gap-4">

          <a
            href="#waitlist"
            className="px-6 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700"
          >
            Join the Waitlist
          </a>

        </div>

      </section>


      {/* FEATURES */}
      <section className="py-2 px-2">

        <div className="max-w-2xl mx-auto grid gap-4">

          <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow">
            <h3 className="font-semibold text-lg">
              Event Scheduling
            </h3>

            <p className="text-slate-600 mt-2">
              Plan rehearsals, concerts, and services with tools designed
              specifically for ensembles.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow">
            <h3 className="font-semibold text-lg">
              Personnel Management
            </h3>

            <p className="text-slate-600 mt-2">
              Track orchestra members, roles, and participation
              across every performance.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow">
            <h3 className="font-semibold text-lg">
              Communication
            </h3>

            <p className="text-slate-600 mt-2">
              Send announcements, invitations, and updates
              directly to your musicians.
            </p>
          </div>

        </div>

      </section>


      {/* WAITLIST */}
      <section
        id="waitlist"
        className="text-center pt-8 pb-6 px-6"
      >

        <h2 className="text-4xl font-semibold">
          Launching Soon
        </h2>

        <p className="text-slate-600 mt-2">
          Join the waitlist to get early access.
        </p>

        <form
          action={joinWaitlist}
          className="mt-6 flex justify-center"
        >

          <div className="flex gap-3 w-full max-w-sm">

            <input
              id="waitlist-email"
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400"
            />

            <input
              type="text"
              name="company"
              className="hidden"
            />

            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-700"
            >
              Join
            </button>

          </div>

        </form>
        
        {params?.joined && (
          <p className="mt-4 text-green-600">
            You're on the waitlist! We'll be in touch.
          </p>
        )}

        {params?.error && (
          <p className="mt-4 text-red-600">
            Please enter a valid email address.
          </p>
        )}

      </section>


      {/* FOOTER */}
      <footer className="text-center text-sm text-slate-500 pb-4">
        © {new Date().getFullYear()} Cadenza
      </footer>

    </main>
  );
}