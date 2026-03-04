/**
 * Cadenza datetime utilities
 *
 * Handles safe conversion between:
 * - Supabase UTC timestamps
 * - datetime-local input fields
 * - human-readable display
 *
 * NEVER manually slice ISO strings outside this file.
 */


/**
 * Convert Supabase UTC timestamp → datetime-local input value
 *
 * Example:
 * 2026-02-23T00:00:00Z → "2026-02-22T19:00" (EST)
 */
export function utcToLocalInput(utcString: string): string {
  const date = new Date(utcString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}


/**
 * Convert datetime-local input → UTC ISO string for Supabase
 *
 * Example:
 * "2026-02-22T19:00" → "2026-02-23T00:00:00.000Z"
 */
export function localInputToUTC(localString: string): string {
  const date = new Date(localString);
  return date.toISOString();
}


/**
 * Format Supabase timestamp → readable display
 *
 * Example:
 * "2026-02-23T00:00:00Z" →
 * "Feb 22, 2026 at 7:00 PM"
 */
export function formatEventDateTime(utcString: string): string {
  const date = new Date(utcString);

  const datePart = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart} at ${timePart}`;
}


/**
 * Format time range
 *
 * Example:
 * start, end →
 * "7:00 PM – 9:30 PM"
 */
export function formatTimeRange(
  startUTC: string,
  endUTC: string
): string {

  const start = new Date(startUTC);
  const end = new Date(endUTC);

  const startStr = start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  const endStr = end.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startStr} – ${endStr}`;
}

/**
 * Add hours to a datetime-local string
 *
 * Example:
 * "2026-02-22T19:00" → +2 → "2026-02-22T21:00"
 */
export function addHours(localString: string, hours: number): string {
  const date = new Date(localString);
  date.setHours(date.getHours() + hours);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}