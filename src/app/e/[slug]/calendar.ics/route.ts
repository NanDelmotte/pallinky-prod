// src/app/e/[slug]/calendar.ics/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { buildIcs } from "@/lib/calendar-utils";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const supabase = createSupabaseServer();

  // Fix: Query table directly instead of RPC
  const { data: e } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!e || !e.starts_at) return new NextResponse("Not found", { status: 404 });

  const hostHeader = req.headers.get("x-forwarded-host") || req.headers.get("host");
  // Fix: Force http for localhost
  let protocol = req.headers.get("x-forwarded-proto") || "https";
  if (hostHeader?.includes("localhost")) protocol = "http";
  
  const origin = `${protocol}://${hostHeader}`;
  const guestUrl = `${origin}/e/${params.slug}`;

  const ics = buildIcs({
    uid: `${e.id}-guest`,
    title: e.title,
    startsAt: new Date(e.starts_at),
    endsAt: e.ends_at ? new Date(e.ends_at) : null,
    location: e.location,
    description: e.description ? `${e.description}\n\nRSVP: ${guestUrl}` : `RSVP: ${guestUrl}`,
    url: guestUrl,
  });

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="invite-${params.slug}.ics"`,
    },
  });
}