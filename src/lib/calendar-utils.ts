// src/lib/calendar-utils.ts

export function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatUtc(dt: Date) {
  return (
    `${dt.getUTCFullYear()}` +
    pad2(dt.getUTCMonth() + 1) +
    pad2(dt.getUTCDate()) +
    "T" +
    pad2(dt.getUTCHours()) +
    pad2(dt.getUTCMinutes()) +
    pad2(dt.getUTCSeconds()) +
    "Z"
  );
}

export function escapeText(s: string) {
  return (s ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

export function buildIcs(args: {
  uid: string;
  title: string;
  startsAt: Date;
  endsAt?: Date | null;
  location?: string | null;
  description?: string | null;
  url: string;
}) {
  const dtstamp = formatUtc(new Date());
  const dtstart = formatUtc(args.startsAt);
  const dtend = args.endsAt ? formatUtc(args.endsAt) : undefined;

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cirklie//V2//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${escapeText(args.uid)}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    ...(dtend ? [`DTEND:${dtend}`] : []),
    `SUMMARY:${escapeText(args.title)}`,
    ...(args.location ? [`LOCATION:${escapeText(args.location)}`] : []),
    ...(args.description ? [`DESCRIPTION:${escapeText(args.description)}`] : []),
    `URL:${escapeText(args.url)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n") + "\r\n";
}