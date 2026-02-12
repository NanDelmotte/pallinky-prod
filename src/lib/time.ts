// src/lib/time.ts
/**
 * TIME STANDARD:
 * All user-facing times are Europe/Amsterdam (CET/CEST).
 * All database-stored times are UTC.
 * We use date-fns-tz to ensure consistency regardless of server or browser location.
 */
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

export const TZ = "Europe/Amsterdam";

/**
 * Converts "YYYY-MM-DDTHH:mm" (from HTML input) to a UTC ISO string.
 */
export function toUTCFromLocalAmsterdam(local: string): string | null {
  if (!local) return null;
  try {
    const utc = fromZonedTime(local, TZ);
    return utc.toISOString();
  } catch {
    return null;
  }
}

/**
 * Formats UTC ISO to: "dd-MM-yy HH:mm" (Amsterdam Time)
 */
export function formatEU(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const date = typeof iso === 'string' ? parseISO(iso) : new Date(iso);
    return formatInTimeZone(date, TZ, "dd-MM-yy HH:mm");
  } catch {
    return "";
  }
}

/**
 * Formats a range: "13-02-26 19:00–21:00" or cross-day "13-02-26 19:00–14-02-26 02:00"
 */
export function formatEURange(
  startsIso: string | null | undefined,
  endsIso: string | null | undefined
): string {
  if (!startsIso) return "";
  if (!endsIso) return formatEU(startsIso);

  try {
    const startDate = parseISO(startsIso);
    const endDate = parseISO(endsIso);

    const startDay = formatInTimeZone(startDate, TZ, "dd-MM-yy");
    const endDay = formatInTimeZone(endDate, TZ, "dd-MM-yy");

    const startTime = formatInTimeZone(startDate, TZ, "HH:mm");
    const endTime = formatInTimeZone(endDate, TZ, "HH:mm");

    if (startDay === endDay) return `${startDay} ${startTime}–${endTime}`;
    return `${startDay} ${startTime}–${endDay} ${endTime}`;
  } catch {
    return formatEU(startsIso);
  }
}

/**
 * Friendly subject-line format, e.g. "February 13 at 19:30"
 */
export function formatFriendlyDateAtTime(
  iso: string | null | undefined
): string {
  if (!iso) return "";
  try {
    const date = parseISO(iso);
    const monthDay = formatInTimeZone(date, TZ, "MMMM d");
    const time = formatInTimeZone(date, TZ, "HH:mm");
    return `${monthDay} at ${time}`;
  } catch {
    return "";
  }
}