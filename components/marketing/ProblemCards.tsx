const problems = [
  {
    title: "Endless email chains",
    description:
      "Stop digging through inboxes to figure out who is attending or who saw the latest update.",
  },
  {
    title: "Spreadsheet overload",
    description:
      "Track attendance, members, and rehearsals in one place instead of scattered files.",
  },
  {
    title: "Disconnected planning",
    description:
      "Keep schedules, announcements, and events together so your orchestra stays aligned.",
  },
];

export default function ProblemCards() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4A44D]">
            Why Cadenza
          </p>

          <h2 className="mt-4 text-4xl font-bold text-[#0F172A]">
            Keeping volunteer ensembles organized should not be a full-time job.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="rounded-3xl border border-slate-200 bg-[#F8FAFC] p-8 shadow-sm"
            >
              <h3 className="text-xl font-semibold text-[#1E293B]">
                {problem.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}