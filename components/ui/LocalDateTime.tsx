"use client";

type Props = {
  isoString: string;
};

export default function LocalDateTime({ isoString }: Props) {
  const date = new Date(isoString);

  return (
    <span>
      {date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      })}
    </span>
  );
}