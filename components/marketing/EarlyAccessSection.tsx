type EarlyAccessSectionProps = {
  joined?: string;
  error?: string;
  action: (formData: FormData) => Promise<void>;
};

export default function EarlyAccessSection({
  joined,
  error,
  action,
}: EarlyAccessSectionProps) {
  return (
    <section
      id="early-access"
      className="bg-[#0F172A] px-6 py-24 text-center text-white"
    >
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A44D]">
          Early Access
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Launching with select community ensembles.
        </h2>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Join early access and help shape Cadenza.
          Be first in line as we bring modern tools
          to community and volunteer orchestras.
        </p>

        <form
          action={action}
          className="mx-auto mt-10 max-w-xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 rounded-xl border border-slate-700 bg-[#1E293B] px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
            />

            <input
              type="text"
              name="company"
              className="hidden"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#D4A44D] px-6 py-3 font-medium text-white transition hover:opacity-90"
            >
              Request Access
            </button>
          </div>
        </form>

        {joined && (
          <p className="mt-6 text-green-400">
            You're on the early access list.
          </p>
        )}

        {error && (
          <p className="mt-6 text-red-400">
            Please enter a valid email address.
          </p>
        )}
      </div>
    </section>
  );
}