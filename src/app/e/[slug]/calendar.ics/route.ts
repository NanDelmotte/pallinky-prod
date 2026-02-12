// src/app/e/[slug]/calendar.ics/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { buildIcs } from "@/lib/calendar-utils";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const supabase = createSupabaseServer();
  const { slug } = params;

  // 1. Case-insensitive lookup (.ilike) handles URL casing vs DB casing
  const { data: e, error } = await supabase
    .from("events")
    .select("*")
    .ilike("slug", slug)
    .single();

  // 2. Consistent Guard Clause: If event doesn't exist or time isn't set, 404.
  // This matches your UI logic where the button only appears if starts_at exists.
  if (error || !e || !e.starts_at) {
    return new NextResponse("Calendar not available", { status: 404 });
  }

  // 3. Tarti-flette vs Pallinky Origin Logic
  const hostHeader = req.headers.get("host") || "localhost:3000";
  const protocol = hostHeader.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${hostHeader}`;
  const guestUrl = `${origin}/e/${slug}`;

  try {
    const ics = buildIcs({
      uid: `${e.id}-guest`,
      title: e.title,
      // Amsterdam Standard: DB UTC string converted to JS Date
      startsAt: new Date(e.starts_at),
      endsAt: e.ends_at ? new Date(e.ends_at) : null,
      location: e.location,
      description: e.description 
        ? `${e.description}\n\nRSVP: ${guestUrl}` 
        : `RSVP: ${guestUrl}`,
      url: guestUrl,
    });

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="invite-${slug}.ics"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (err: any) {
    console.error(`[ICS Gen Error]`, err.message);
    return new NextResponse("Error generating calendar file", { status: 500 });
  }
}