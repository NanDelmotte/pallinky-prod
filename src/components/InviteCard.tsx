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
  const boxStyle: React.CSSProperties = {
    padding: "12px 10px",
    borderRadius: 12,
    border: "1px solid var(--button-bg)",
    background: "var(--button-bg)",
    color: "var(--button-txt)",
    textAlign: "center",
    fontWeight: 700,
    lineHeight: 1.1,
  };

  return (
    <div className="c-stack">
      <div className="c-label" style={{ marginBottom: 6, color: "var(--text)" }}>
        RSVP — preview
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <div style={boxStyle}>Going</div>
        <div style={boxStyle}>Maybe</div>
        <div style={boxStyle}>No</div>
      </div>
    </div>
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
    <div 
      className="c-card" 
      style={{ 
        backgroundColor: "var(--box-bg, white)", 
        color: "var(--text)",
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Upper Content Section */}
      <div className="c-section" style={{ position: "relative", backgroundColor: 'transparent' }}>
        {showHeaderInCard && (
          <div style={{ paddingRight: isPreview && props.editHref ? 110 : 0 }}>
            <div className="c-title" style={{ fontSize: 18, color: "inherit" }}>
              {props.event.title}
            </div>
            {props.headerWhenLine && (
              <div className="c-subtitle" style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75, color: "inherit" }}>
                {props.headerWhenLine}
              </div>
            )}
          </div>
        )}

        {isPreview && props.editHref && (
          <Link
            href={props.editHref}
            style={{
              position: "absolute",
              top: showHeaderInCard ? 8 : 10,
              right: 10,
              display: "inline-flex",
              gap: 6,
              alignItems: "center",
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "var(--surface-strong)",
              color: "#111827",
              textDecoration: "none",
              fontWeight: 650,
              fontSize: 12,
            }}
          >
            <IconPencil size={14} />
            Personalize
          </Link>
        )}

        <div style={{ marginTop: showHeaderInCard ? 14 : 0 }}>
          {props.event.host_name && <div className="c-help" style={{ color: "inherit" }}>Hosted by {props.event.host_name}</div>}
          {props.event.location && <div className="c-help" style={{ color: "inherit" }}>{props.event.location}</div>}

          {props.event.cover_image_url && (
            <div className="c-mediaPreview" style={{ marginTop: "var(--space-2)", border: 'none' }}>
              <img
                src={props.event.cover_image_url}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          )}

          {props.event.description && (
            <div className="c-help" style={{ whiteSpace: "pre-wrap", lineHeight: 1.45, color: "inherit", marginTop: 12 }}>
              {props.event.description}
            </div>
          )}
        </div>
      </div>

      {/* Internal Divider */}
      <div style={{ height: '1px', background: 'var(--text)', opacity: 0.1, margin: '0 16px' }} />

      {/* Lower RSVP Section */}
      <div className="c-section" style={{ backgroundColor: 'transparent' }}>
        {isPreview ? (
          <RsvpPreview />
        ) : (
          <RsvpForm slug={props.slug} disabled={isCancelled} />
        )}
      </div>
    </div>
  );
}