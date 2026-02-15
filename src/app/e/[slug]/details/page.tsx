/**
 * Path: src/app/e/[slug]/details/page.tsx
 */

import Link from "next/link";
import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { paletteForGif } from "@/lib/palette";
import { formatFriendlyDateAtTime } from "@/lib/time";

type Row = { name: string; status: "yes" | "maybe" | "no"; responded_at: string };

export default async function DetailsPage({ params }: { params: { slug: string } }) {
  const supabase = createSupabaseServer();

  const { data: e } = await supabase
    .from("events")
    .select("*")
    .ilike("slug", params.slug)
    .single();

  if (!e) {
    return (
      <Shell title="Not found" subtitle="This invite link doesn’t match an event.">
        <div className="c-stack">
          <div className="c-help">Ask the host to resend the invite link.</div>
        </div>
      </Shell>
    );
  }

  const { data: list } = await supabase.rpc("get_guest_list", { p_slug: params.slug });
  const rows = (list || []).map((r: any) => ({
    name: r.name,
    status: r.status,
    responded_at: r.responded_at || r.created_at
  })) as Row[];

  // Deduplicate and sort
  const latestByName = new Map<string, Row>();
  for (const r of rows) {
    const key = r.name.trim().toLowerCase();
    const prev = latestByName.get(key);
    if (!prev || new Date(r.responded_at).getTime() > new Date(prev.responded_at).getTime()) {
      latestByName.set(key, r);
    }
  }

  const deduped = Array.from(latestByName.values());
  const grouped = {
    yes: deduped.filter(r => r.status === "yes"),
    maybe: deduped.filter(r => r.status === "maybe"),
    no: deduped.filter(r => r.status === "no")
  };

  const paletteKey = paletteForGif(e.gif_key ?? null);
  const whenLine = e.starts_at ? formatFriendlyDateAtTime(e.starts_at) : null;

  return (
    <Shell paletteKey={paletteKey}>
      <div className="c-stack" style={{ gap: "var(--space-4)" }}>
        
        {/* Event Header */}
        <section className="c-stack" style={{ gap: "var(--space-2)" }}>
          <div style={{ display: "grid", gap: "4px" }}>
            <h1 className="c-title" style={{ fontSize: "22px" }}>{e.title}</h1>
            {whenLine && (
              <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>
                {whenLine}
              </div>
            )}
            {e.location && (
              <div style={{ fontSize: "15px", opacity: 0.8, color: "var(--text)" }}>
                📍 {e.location}
              </div>
            )}
          </div>

          {e.cover_image_url && (
            <div className="c-mediaPreview">
              <img src={e.cover_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {e.description && (
            <div style={{ fontSize: "15px", whiteSpace: "pre-wrap", lineHeight: 1.5, color: "var(--text)", opacity: 0.9 }}>
              {e.description}
            </div>
          )}
          
          <div style={{ fontSize: "13px", opacity: 0.6, color: "var(--text)" }}>
            Hosted by {e.host_name || "a friend"}
          </div>
        </section>

        {/* Actions */}
        <section className="c-actions">
          {e.starts_at && (
            <a className="c-btnSecondary" href={`/e/${params.slug}/calendar.ics`}>Save to Calendar</a>
          )}
          <Link className="c-btnSecondary" href={`/e/${params.slug}`}>Change RSVP</Link>
        </section>

        <div className="c-divider" />

        {/* Guest List pills */}
        <section className="c-stack">
          <div className="c-sectionTitle">Who's coming</div>
          <GuestGroup title="Going" rows={grouped.yes} />
          <GuestGroup title="Maybe" rows={grouped.maybe} />
        </section>
      </div>
    </Shell>
  );
}

function GuestGroup({ title, rows }: { title: string; rows: { name: string }[] }) {
  if (rows.length === 0) return null;

  return (
    <div className="c-stack" style={{ gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", opacity: 0.7 }}>
        {title} ({rows.length})
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {rows.map((r, i) => (
          <span 
            key={`${r.name}-${i}`} 
            style={{ 
              padding: "6px 12px", 
              borderRadius: "999px", 
              border: "1px solid var(--border)", 
              background: "var(--surface-strong)", 
              color: "var(--text)",
              fontWeight: 600, 
              fontSize: "14px" 
            }}
          >
            {r.name}
          </span>
        ))}
      </div>
    </div>
  );
}