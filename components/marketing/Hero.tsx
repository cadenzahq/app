import Image from "next/image";
import BrowserFrame from "./BrowserFrame";

export default function Hero() {
  return (
    <section className="bg-[#F8FAFC] px-6 py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A44D]">
            Built for volunteer ensembles
          </p>

          <h1 className="text-5xl font-bold tracking-tight text-[#0F172A] md:text-6xl">
            Orchestra management without the spreadsheets.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Built for community and volunteer ensembles.
            Cadenza replaces scattered spreadsheets,
            email chains, and disconnected tools
            with one place to manage rehearsals,
            attendance, announcements, and members.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#early-access"
              className="rounded-xl bg-[#D4A44D] px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Request Early Access
            </a>
          </div>
        </div>

        <BrowserFrame>
          <Image
            src="/marketing/dashboard.png"
            alt="Cadenza dashboard"
            width={1800}
            height={1100}
            className="h-auto w-full"
            priority
          />
        </BrowserFrame>
      </div>
    </section>
  );
}