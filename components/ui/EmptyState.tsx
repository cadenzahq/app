type EmptyStateType =
  | "events"
  | "members"
  | "announcements";

interface Props {
  type: EmptyStateType;
}

const config: Record<
  EmptyStateType,
  {
    title: string;
    description: string;
  }
> = {
  events: {
    title: "No events yet",
    description:
      "Create your first event to get started.",
  },

  members: {
    title: "No members yet",
    description:
      "Add members to begin managing your orchestra.",
  },

  announcements: {
    title: "No announcements yet",
    description:
      "Announcements will appear here once posted.",
  },
};

export default function EmptyState({
  type,
}: Props) {
  const state = config[type];

  return (
    <div className="border border-navy/20 rounded-xl p-8 text-center bg-white shadow-sm">
      <h2 className="text-lg font-semibold text-midnight mb-2">
        {state.title}
      </h2>

      <p className="text-sm text-navy/70">
        {state.description}
      </p>
    </div>
  );
}