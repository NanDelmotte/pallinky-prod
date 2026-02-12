"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import Shell from "@/components/Shell";
import { formatFriendlyDateAtTime } from "@/lib/time";
import InviteCard from "@/components/InviteCard";
import { useRouter } from "next/navigation";

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

function cardVarsForGifKey(gifKey?: string | null): React.CSSProperties {
  const k = (gifKey || "").trim().toLowerCase();
  if (k === "girly") {
    return {
      ["--bg" as any]: "#f4bbd3",
      ["--surface" as any]: "rgba(255, 255, 255, 0.92)",
      ["--surface-strong" as any]: "#ffffff",
      ["--text" as any]: "#2b1f24",
      ["--muted" as any]: "#6b4a5a",
      ["--border" as any]: "rgba(254, 93, 159, 0.35)",
      ["--accent" as any]: "#fe5d9f",
      ["--accent-contrast" as any]: "#ffffff",
      ["--focus" as any]: "rgba(254, 93, 159, 0.45)",
    };
  }
  if (k === "fiesta") {
    return {
      ["--bg" as any]: "#1729ae",
      ["--surface" as any]: "rgba(255, 255, 255, 0.10)",
      ["--surface-strong" as any]: "rgba(255, 255, 255, 0.12)",
      ["--text" as any]: "#ffffff",
      ["--muted" as any]: "rgba(255, 255, 255, 0.78)",
      ["--border" as any]: "rgba(255, 255, 255, 0.18)",
      ["--accent" as any]: "#fe20e8",
      ["--accent-contrast" as any]: "#ffffff",
      ["--focus" as any]: "rgba(254, 32, 232, 0.40)",
    };
  }
  if (k === "classy") {
    return {
      ["--bg" as any]: "#03172f",
      ["--surface" as any]: "rgba(255, 255, 255, 0.08)",
      ["--surface-strong" as any]: "rgba(255, 255, 255, 0.10)",
      ["--text" as any]: "#fff7b6",
      ["--muted" as any]: "rgba(255, 247, 182, 0.75)",
      ["--border" as any]: "rgba(239, 212, 102, 0.24)",
      ["--accent" as any]: "#efd466",
      ["--accent-contrast" as any]: "#03172f",
      ["--focus" as any]: "rgba(239, 212, 102, 0.35)",
    };
  }
  if (k === "spicy") {
    return {
      ["--bg" as any]: "#656c12",
      ["--surface" as any]: "rgba(255, 255, 255, 0.10)",
      ["--surface-strong" as any]: "rgba(255, 255, 255, 0.12)",
      ["--text" as any]: "#ffffff",
      ["--muted" as any]: "rgba(255, 255, 255, 0.78)",
      ["--border" as any]: "rgba(255, 255, 255, 0.18)",
      ["--accent" as any]: "#ecc216",
      ["--accent-contrast" as any]: "#1b1b1b",
      ["--focus" as any]: "rgba(236, 194, 22, 0.42)",
    };
  }
  return {
    ["--bg" as any]: "#f8e9dc",
    ["--surface" as any]: "rgba(255, 255, 255, 0.92)",
    ["--surface-strong" as any]: "#ffffff",
    ["--text" as any]: "#1f2a1b",
    ["--muted" as any]: "#5d6a5b",
    ["--border" as any]: "rgba(67, 105, 27, 0.16)",
    ["--accent" as any]: "#43691b",
    ["--accent-contrast" as any]: "#ffffff",
    ["--focus" as any]: "rgba(67, 105, 27, 0.28)",
  };
}

function IconShare(props: { size?: number }) {
  const s = props.size ?? 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 8l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconCalendar(props: { size?: number }) {
  const s = props.size ?? 18;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 11h3v3H8v-3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function PreviewClient({
  slug,
  mt,
  event,
  markSharedAction,
}: {
  slug: string;
  mt: string;
  event: EventSummary;
  markSharedAction: (formData: FormData) => Promise<void>;
}) {
  const publicPath = useMemo(() => `/e/${slug}`, [slug]);
  const hostCalendarPath = useMemo(() => `/m/${mt}/calendar.ics`, [mt]);
  const editHref = useMemo(() => `/m/${mt}/edit`, [mt]);
  const router = useRouter();

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const protocol = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" ? "http:" : "https:";
    return `${protocol}//${window.location.host}${publicPath}`;
  }, [publicPath]);

  const hasValidStart = useMemo(() => {
    const s = (event.starts_at || "").trim();
    if (!s) return false;
    const t = new Date(s).getTime();
    return Number.isFinite(t);
  }, [event.starts_at]);

  const whenLine = useMemo(() => {
    if (!hasValidStart) return "";
    return formatFriendlyDateAtTime(event.starts_at as string);
  }, [hasValidStart, event.starts_at]);

  const shareText = useMemo(() => {
    const host = (event.host_name || "").trim();
    const title = (event.title || "").trim();
    const when = whenLine.trim();
    
    // Constructing the "Yippee!" string exactly as requested
    let s = `${shareUrl} Yippee! `;
    if (host) s += `${host} is inviting you`;
    else s += "You’re invited";
    if (title) s += ` to ${title}`;
    s += ". Click here to RSVP.";
    return s;
  }, [shareUrl, event.host_name, event.title, whenLine]);

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!qrOpen || !shareUrl) return;
    QRCode.toDataURL(shareUrl, { margin: 1, width: 240 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [shareUrl, qrOpen]);

  async function onShare() {
    if (!shareUrl) return;

    try {
      if (navigator.share) {
        // We only pass 'text' because 'text' already contains the URL.
        // If we pass a separate 'url' property, most mobile browsers will append it twice.
        await navigator.share({
          text: shareText, 
        });
        router.push(`/m/${mt}`);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareText);
        alert("Invite text copied!");
        router.push(`/m/${mt}`);
      }
    } catch {
      // user cancelled share → do nothing
    }
  }

  const cardVars = useMemo(() => cardVarsForGifKey(event.gif_key ?? null), [event.gif_key]);

  return (
    <Shell title="Ready to share" subtitle="" paletteKey={null}>
      <div className="c-stack">
        <section className="c-section">
          <div style={{ ...cardVars, borderRadius: 14, padding: 12, background: "var(--bg)", color: "var(--text)", boxShadow: "0 10px 30px rgba(0,0,0,0.10)" }}>
            <div className="c-card c-card--tight" style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)" }}>
              <InviteCard slug={slug} event={event} mode="preview" editHref={editHref} showHeaderInCard headerWhenLine={whenLine} />
            </div>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <button className="c-btnPrimary" type="button" onClick={onShare} style={{ display: "inline-flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
              <IconShare />
              Share with guests
            </button>

            <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
              <a href={hostCalendarPath} style={{ display: "inline-flex", alignItems: "center", gap: 10, width: "fit-content", padding: "9px 12px", borderRadius: 999, border: "1px solid var(--border)", background: "transparent", color: "var(--text)", fontWeight: 400, fontSize: 14, textDecoration: "none", lineHeight: 1.1 }}>
                <IconCalendar />
                Add to my calendar
              </a>

              <details open={qrOpen} onToggle={(e) => setQrOpen((e.currentTarget as HTMLDetailsElement).open)}>
                <summary className="c-btnLink">Show QR code</summary>
                {qrDataUrl && (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                    <img src={qrDataUrl} alt="Invite QR code" style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-strong)" }} />
                  </div>
                )}
              </details>
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}