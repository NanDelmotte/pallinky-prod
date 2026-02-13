"use client";

import Link from "next/link";
import RsvpForm from "@/app/e/[slug]/rsvp-form";

type EventSummary = {
  host_name: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  ends_at?: string | null;
  location: string | null;
  gif_key?: string | null;
  cover_image_url?: string | null;
  status?: "active" | "cancelled" | string;
};

export default function InviteCard({
  slug,
  event,
  mode = "guest",
  editHref,
  headerWhenLine,
  showHeaderInCard = false
}: {
  slug: string;
  event: EventSummary;
  mode?: "guest" | "preview";
  editHref?: string;
  headerWhenLine?: string;
  showHeaderInCard?: boolean;
}) {
  const isPreview = mode === "preview";
  const isCancelled = event.status === "cancelled";

  return (
    <div className="c-stack">
      <header style={{ position: "relative" }}>
        {showHeaderInCard && (
          <div style={{ paddingRight: isPreview ? 80 : 0 }}>
            <h1 className="c-title" style={{ fontSize: "1.25rem" }}>{event.title}</h1>
            {headerWhenLine && <p className="c-subtitle">{headerWhenLine}</p>}
          </div>
        )}

        {isPreview && editHref && (
          <Link href={editHref} className="c-btnSecondary" style={{ position: "absolute", top: 0, right: 0, padding: "6px 12px", borderRadius: "99px", fontSize: "12px" }}>
            Edit
          </Link>
        )}
      </header>

      <div className="c-stack" style={{ gap: "var(--space-2)" }}>
        {event.host_name && <p className="c-help">Hosted by <strong>{event.host_name}</strong></p>}
        {event.location && <p className="c-help">📍 {event.location}</p>}

        {event.cover_image_url && (
          <div className="c-mediaPreview">
            <img src={event.cover_image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}

        {event.description && (
          <p className="c-help" style={{ whiteSpace: "pre-wrap", color: "var(--text)" }}>
            {event.description}
          </p>
        )}

        {isCancelled && (
          <div className="c-card" style={{ background: "#fee2e2", color: "#991b1b", textAlign: "center", fontWeight: 600 }}>
            This event has been cancelled.
          </div>
        )}
      </div>

      <div className="c-divider" />

      <section>
        {isPreview ? (
          <div className="c-stack" style={{ opacity: 0.5, pointerEvents: "none" }}>
            <span className="c-label">RSVP — Preview</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {["Going", "Maybe", "No"].map(t => (
                <div key={t} className="c-btnSecondary" style={{ padding: "8px" }}>{t}</div>
              ))}
            </div>
          </div>
        ) : (
          <RsvpForm slug={slug} disabled={isCancelled} />
        )}
      </section>
    </div>
  );
}