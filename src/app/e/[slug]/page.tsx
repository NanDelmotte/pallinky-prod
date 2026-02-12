// src/app/e/[slug]/page.tsx

import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { paletteForGif } from "@/lib/palette";
import { formatFriendlyDateAtTime } from "@/lib/time";
import RsvpForm from "./rsvp-form";
import Link from "next/link";

export default async function EventRsvpPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { token?: string };
}) {
  const supabase = createSupabaseServer();
  
  // 1. Identification Logic
  const token = searchParams.token;
  const isHost = token?.startsWith('HOST-');
  const manageHandle = isHost ? token?.replace('HOST-', '') : null;

  // 2. Fetch Event Data
  // ✅ NEW CODE - Querying the public schema directly by slug
const { data: e, error } = await supabase
  .from("events")
  .select("*")
  .eq("slug", params.slug)
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

  // 3. Fetch Existing RSVP (for returning guests/hosts)
  let existingRsvp = null;
  if (token) {
    const { data: rsvpData } = await supabase
      .from("rsvps")
      .select("name, status")
      .eq("guest_token", token)
      .single();
    existingRsvp = rsvpData;
  }

  const paletteKey = paletteForGif(e.gif_key ?? null);
  const whenLine = e.starts_at
    ? formatFriendlyDateAtTime(e.starts_at)
    : null;

  return (
    <Shell paletteKey={paletteKey} tightCard>
      <div className="c-stack">
        
        {/* Host Context Banner */}
        {isHost && (
          <div style={{ 
            background: 'var(--accent)', 
            color: 'var(--accent-contrast)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <span>Viewing as Host</span>
            <Link href={`/m/${manageHandle}`} style={{ textDecoration: 'underline', color: 'inherit' }}>
              Manage Event →
            </Link>
          </div>
        )}

        <section className="c-section">
          <div style={{ display: "grid", gap: 4 }}>
            <div className="c-title" style={{ fontSize: 18, margin: 0 }}>
              {e.title}
            </div>

            {whenLine ? (
              <div
                className="c-subtitle"
                style={{ fontSize: 13, opacity: 0.75, margin: 0 }}
              >
                {whenLine}
              </div>
            ) : null}

            {e.host_name ? (
              <div className="c-help" style={{ margin: 0 }}>
                Hosted by {e.host_name}
              </div>
            ) : null}
          </div>

          {e.location ? <div className="c-help">{e.location}</div> : null}

          {e.cover_image_url ? (
            <div className="c-mediaPreview" style={{ marginTop: "var(--space-2)" }}>
              <img
                src={e.cover_image_url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : null}

          {e.description ? (
            <div className="c-help" style={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
              {e.description}
            </div>
          ) : null}

          {e.status === "cancelled" ? (
            <div
              style={{
                padding: 10,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                background: "var(--surface-strong)",
                fontWeight: 650,
                marginTop: 10,
              }}
            >
              This event has been cancelled.
            </div>
          ) : null}
        </section>

        <div className="c-divider" />

        <section className="c-section">
          {isHost ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0', display: 'grid', gap: 'var(--space-1)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✨</div>
              <div className="c-title" style={{ fontSize: 16 }}>You’re on the list!</div>
              <p className="c-help" style={{ marginBottom: '16px' }}>
                Since you’re the host, we’ve already marked you as "Going."
              </p>
              <Link href={`/m/${manageHandle}`} className="c-btnPrimary">
                Edit Event Details
              </Link>
            </div>
          ) : existingRsvp ? (
            /* Recognized Guest Experience */
            <div style={{ textAlign: 'center', padding: 'var(--space-4) 0', display: 'grid', gap: 'var(--space-1)' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {existingRsvp.status === 'yes' ? '✅' : existingRsvp.status === 'maybe' ? '⏳' : '❌'}
              </div>
              <div className="c-title" style={{ fontSize: 16 }}>
                {existingRsvp.name}, you're {existingRsvp.status === 'yes' ? 'going!' : existingRsvp.status === 'maybe' ? 'a maybe.' : 'not going.'}
              </div>
              <p className="c-help" style={{ marginBottom: '16px' }}>
                Need to change your plans?
              </p>
              {/* This link reloads the page without the token to "reset" the view, 
                  or we could add a state to RsvpForm to show it again */}
              <Link href={`?token=${token}&edit=true`} className="c-btnSecondary">
                Edit your RSVP
              </Link>
            </div>
          ) : (
            /* Standard Guest RSVP */
            <RsvpForm slug={params.slug} disabled={e.status === "cancelled"} token={token} />
          )}
        </section>
      </div>
    </Shell>
  );
}