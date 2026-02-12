// src/components/InviteCard.tsx
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

function IconPencil(props: { size?: number }) {
  const s = props.size ?? 16;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RsvpPreview() {
  const box: React.CSSProperties = {
    padding: "12px 10px",
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "transparent",
    textAlign: "center",
    fontWeight: 650,
    lineHeight: 1.1,
  };

  return (
    <section className="c-stack">
      <div className="c-label" style={{ marginBottom: 6 }}>
        RSVP — preview
      </div>

      <div style={{ opacity: 0.65, pointerEvents: "none" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={box}>Going</div>
          <div style={box}>Maybe</div>
          <div style={box}>No</div>
        </div>

        <div className="c-help" style={{ marginTop: 10, textAlign: "center", opacity: 0.85 }}>
          Guests will respond here
        </div>
      </div>
    </section>
  );
}

export default function InviteCard(props: {
  slug: string;
  event: EventSummary;
  mode?: "guest" | "preview";
  editHref?: string;

  headerWhenLine?: string;
  showHeaderInCard?: boolean;
}) {
  const mode = props.mode ?? "guest";
  const isPreview = mode === "preview";
  const isCancelled = (props.event.status || "") === "cancelled";
  const showHeaderInCard = !!props.showHeaderInCard;

  return (
    <div className="c-stack">
      <section className="c-section" style={{ position: "relative" }}>
        {showHeaderInCard ? (
          <div style={{ paddingRight: isPreview && props.editHref ? 86 : 0 }}>
            <div className="c-title" style={{ fontSize: 18 }}>
              {props.event.title}
            </div>

            {props.headerWhenLine ? (
              <div className="c-subtitle" style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
                {props.headerWhenLine}
              </div>
            ) : null}
          </div>
        ) : null}

        {isPreview && props.editHref ? (
          <Link
            href={props.editHref}
            style={{
              position: "absolute",
              top: showHeaderInCard ? 8 : 10,
              right: 10,
              display: "inline-flex",
              gap: 8,
              alignItems: "center",
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              color: "var(--text)",
              textDecoration: "none",
              fontWeight: 650,
              fontSize: 13,
              opacity: 0.9,
            }}
            aria-label="Edit"
          >
            <IconPencil />
            Edit
          </Link>
        ) : null}

        <div style={{ marginTop: showHeaderInCard ? 10 : 0 }}>
          {props.event.host_name ? <div className="c-help">Hosted by {props.event.host_name}</div> : null}
          {props.event.location ? <div className="c-help">{props.event.location}</div> : null}

          {props.event.cover_image_url ? (
            <div className="c-mediaPreview" style={{ marginTop: "var(--space-2)" }}>
              <img
                src={props.event.cover_image_url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          ) : null}

          {props.event.description ? (
            <div className="c-help" style={{ whiteSpace: "pre-wrap", lineHeight: 1.45 }}>
              {props.event.description}
            </div>
          ) : null}

          {isCancelled ? (
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
        </div>
      </section>

      <div className="c-divider" />

      <section className="c-section">
        {isPreview ? <RsvpPreview /> : <RsvpForm slug={props.slug} disabled={isCancelled} />}
      </section>
    </div>
  );
}
