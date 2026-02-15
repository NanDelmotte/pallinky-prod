import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { formatEU } from "@/lib/time";
import { paletteForGif } from "@/lib/palette";
import HostIdentification from "@/components/HostIdentification";

export default async function ManageHome({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createSupabaseServer();
  
  // Use params.token exactly as your database expects it
  const { data } = await supabase.rpc("get_event_by_manage_token", {
    p_manage_token: params.token,
  });

  const e = data?.[0];

  // If this triggers, it means the token in the URL isn't finding a match in the DB
  if (!e) {
    return (
      <Shell title="Invalid link" subtitle="This manage link doesn’t match an event.">
        <div className="c-stack">
          <section className="c-section">
            <div className="c-help">
              Token received: {params.token}
            </div>
          </section>
          <Link href="/create" className="c-btnPrimary">
            Create a new event
          </Link>
        </div>
      </Shell>
    );
  }

  if (e.status === "cancelled") {
    redirect(`/m/${params.token}/cancelled`);
  }

  const paletteKey = paletteForGif(e.gif_key ?? null);

  // --- FIX: Build the URL with data so the Preview isn't blank ---
  const sp = new URLSearchParams();
  sp.set("slug", e.slug || "");
  sp.set("mt", params.token);
  sp.set("host_name", e.host_name || "");
  sp.set("title", e.title || "");
  sp.set("location", e.location || "");
  sp.set("description", e.description || "");
  sp.set("gif_key", e.gif_key || "zen");
  if (e.starts_at) sp.set("starts_at", e.starts_at);

  const shareAgainHref = `/create/preview?${sp.toString()}`;
  // -------------------------------------------------------------

  const displayTime = e.starts_at ? formatEU(e.starts_at) : "Time not set";
  const shellSubtitle = e.starts_at ? `${e.title} · ${displayTime}` : e.title;

  return (
    <Shell title="You’re hosting" subtitle={shellSubtitle} paletteKey={paletteKey}>
      <HostIdentification email={e.host_email} />
      <div className="c-stack">
        <section className="c-section">
          <div style={{ fontWeight: 700, fontSize: 18 }}>{e.title}</div>
          <div className="c-help">{displayTime}</div>
        </section>

        <section className="c-section">
          <Link href={`/m/${params.token}/guests`} className="c-btnPrimary" style={{ width: "100%" }}>
            See who’s coming
          </Link>
        </section>

        <section className="c-section">
          <div className="c-actions">
            {/* This link now carries Nancy and Karaoke to the preview page */}
            <Link href={shareAgainHref} className="c-btnSecondary">
              Share invite again
            </Link>

            {e.starts_at && (
              <a href={`/m/${params.token}/calendar.ics`} className="c-btnSecondary">
                Add to my calendar
              </a>
            )}
          </div>
        </section>

        <section className="c-section" style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-3)" }}>
          <Link href="/my-events" className="c-btnSecondary" style={{ justifyContent: 'center' }}>
            View all my events
          </Link>
        </section>

        <section className="c-section" style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-3)" }}>
          <div className="c-actions">
            <Link href={`/m/${params.token}/edit`} className="c-btnSecondary">Edit event</Link>
            <Link href={`/m/${params.token}/cancel`} className="c-btnSecondary" style={{ color: "var(--danger)" }}>Cancel event</Link>
          </div>
        </section>
      </div>
    </Shell>
  );
}