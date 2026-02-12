// src/app/m/[token]/page.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { formatEU } from "@/lib/time";
import { paletteForGif } from "@/lib/palette";

export default async function ManageHome({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createSupabaseServer();
  const { data } = await supabase.rpc("get_event_by_manage_token", {
    p_manage_token: params.token,
  });

  const e = data?.[0];

  if (!e) {
    return (
      <Shell title="Invalid link" subtitle="This manage link doesn’t match an event.">
        <div className="c-stack">
          <section className="c-section">
            <div className="c-help">
              Open the manage URL you saved when you created the event.
            </div>
          </section>

          <Link href="/create" className="c-btnPrimary">
            Create a new event
          </Link>
        </div>
      </Shell>
    );
  }

  // 🔒 Active events only
  if (e.status === "cancelled") {
    redirect(`/m/${params.token}/cancelled`);
  }

  if (e.status === "expired") {
    redirect(`/m/${params.token}/ended`);
  }

  const paletteKey = paletteForGif(e.gif_key ?? null);

  const shareAgainHref = `/create/preview?slug=${encodeURIComponent(
    e.slug
  )}&mt=${encodeURIComponent(params.token)}`;

  // Amsterdam Standard logic for missing dates
  const displayTime = e.starts_at ? formatEU(e.starts_at) : "Time not set";
  const shellSubtitle = e.starts_at ? `${e.title} · ${displayTime}` : e.title;

  return (
    <Shell
      title="You’re hosting"
      subtitle={shellSubtitle}
      paletteKey={paletteKey}
    >
      <div className="c-stack">
        {/* Section 1 — Event status (informational) */}
        <section className="c-section">
          <div style={{ fontWeight: 700, fontSize: 18 }}>{e.title}</div>
          <div className="c-help">{displayTime}</div>

          <div
            style={{
              display: "inline-block",
              marginTop: "var(--space-2)",
              padding: "4px 10px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Active
          </div>
        </section>

        {/* Section 2 — Primary action */}
        <section className="c-section">
          <Link
            href={`/m/${params.token}/guests`}
            className="c-btnPrimary"
            style={{ width: "100%" }}
          >
            See who’s coming
          </Link>
        </section>

        {/* Section 3 — Secondary actions */}
        <section className="c-section">
          <div className="c-actions">
            <Link href={shareAgainHref} className="c-btnSecondary">
              Share invite again
            </Link>

            {/* FIX: Only show button if a date/time exists */}
            {e.starts_at && (
              <a
                href={`/m/${params.token}/calendar.ics`}
                className="c-btnSecondary"
              >
                Add to my calendar
              </a>
            )}
          </div>
        </section>

        {/* Section 4 — Event management (tertiary) */}
        <section
          className="c-section"
          style={{ borderTop: "1px solid var(--border)", paddingTop: "var(--space-3)" }}
        >
          <div className="c-actions">
            <Link href={`/m/${params.token}/edit`} className="c-btnSecondary">
              Edit event
            </Link>

            <Link
              href={`/m/${params.token}/cancel`}
              className="c-btnSecondary"
              style={{ color: "var(--danger)" }}
            >
              Cancel event
            </Link>
          </div>
        </section>

        {/* Section 5 — Forward action */}
        <section className="c-section">
          <Link href="/create/details" className="c-btnSecondary">
            Create new event
          </Link>

          <div className="c-help">
            Creating a new event won’t affect this one.
          </div>
        </section>
      </div>
    </Shell>
  );
}