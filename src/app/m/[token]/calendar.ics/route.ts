// src/app/m/[token]/calendar.ics/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { buildIcs } from "@/lib/calendar-utils";

export async function GET(
  req: Request,
  { params }: { params: { token: string } }
) {
  const supabase = createSupabaseServer();

  const { data } = await supabase.rpc("get_event_by_manage_token", {
    p_manage_token: params.token,
  });
  const e = data?.[0];

  // Amsterdam Standard Guard: If no event or no start time, we don't serve an ICS
  if (!e || !e.starts_at) {
    return new NextResponse("Calendar not available", { status: 404 });
  }

  const hostHeader = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  
  // Tarti-flette vs Pallinky protocol check
  let protocol = req.headers.get("x-forwarded-proto") || "https";
  if (hostHeader.includes("localhost")) protocol = "http";
  
  const origin = `${protocol}://${hostHeader}`;
  const manageUrl = `${origin}/m/${params.token}`;

  const fullDescription = e.description 
    ? `${e.description}\n\nManage your event: ${manageUrl}`
    : `Manage your event: ${manageUrl}`;

  try {
    const ics = buildIcs({
      uid: `${e.id}-host`, 
      title: `[HOST] ${e.title}`, 
      startsAt: new Date(e.starts_at),
      endsAt: e.ends_at ? new Date(e.ends_at) : null,
      location: e.location,
      description: fullDescription,
      url: manageUrl,
    });

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8; method=PUBLISH",
        "Content-Disposition": `attachment; filename="manage-${params.token}.ics"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    return new NextResponse("Error generating calendar", { status: 500 });
  }
}