type Props = {
  event: any
  series?: { name: string } | null
  season?: { name: string } | null
}

export default function EventHeader({ event, series, season }: Props) {
  const date = new Date(event.start_time).toLocaleDateString()

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold">
        {event.name}
      </h1>

      <div className="text-gray-500">
        {date} • {event.location}
      </div>

      {(series || season) && (
        <div className="text-sm text-gray-400">
          {series?.name}
          {series && season && " • "}
          {season?.name}
        </div>
      )}
    </div>
  )
}