/**
 * Cadenza datetime utilities
 *
 * Single source of truth for ALL datetime formatting.
 */

const TIMEZONE = "America/New_York";

/**
 * Convert Supabase UTC timestamp → datetime-local input value
 */
export function utcToLocalInput(utcString: string): string {
  const date = new Date(utcString);

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/**
 * Convert datetime-local input → UTC ISO string
 */
export function localInputToUTC(localString: string): string {
  return new Date(localString).toISOString();
}

/**
 * Cadenza datetime utilities (FIXED)
 *
 * Handles Supabase timestamps safely without corrupting valid ISO strings
 */

/**
 * Normalize Supabase timestamp safely
 */
function parseDate(value: string): Date {
  if (!value) return new Date(NaN);

  // If already ISO with timezone (+00:00 or Z), use as-is
  if (value.includes("T")) {
    return new Date(value);
  }

  // Fallback: convert space-separated to ISO
  return new Date(value.replace(" ", "T"));
}

/**
 * Format Supabase timestamp → readable display
 */
export function formatEventDateTime(utcString: string): string {
  const date = parseDate(utcString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Format time range
 */
export function formatTimeRange(
  startUTC: string,
  endUTC: string | null
): string {
  const start = new Date(startUTC);

  const startStr = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(start);

  if (!endUTC) return `${startStr} (end time TBD)`;

  const end = new Date(endUTC);

  const endStr = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  }).format(end);

  return `${startStr} – ${endStr}`;
}

/**
 * Add hours to datetime-local string
 */
export function addHours(localString: string, hours: number): string {
  const date = new Date(localString);
  date.setHours(date.getHours() + hours);

  return date.toISOString().slice(0, 16);
}