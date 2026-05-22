import Link from "next/link";

export default function SeriesEvents({
  events,
  currentEventId,
}: any) {

  return (
    <div>

      <h2 className="text-lg font-semibold mb-3">
        Series Events
      </h2>

      <ul className="space-y-1">

        {events?.map((e: any) => {

          const active = e.id === currentEventId;

          return (
            <li key={e.id}>

              <Link
                href={`/events/${e.id}`}
                className={
                  active
                    ? "font-semibold"
                    : "text-gray-500 hover:text-black"
                }
              >
                {e.name}
              </Link>

            </li>
          );
        })}

      </ul>
    </div>
  );
}