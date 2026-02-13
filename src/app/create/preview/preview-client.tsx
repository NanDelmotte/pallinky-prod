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

// Returns a plain object of CSS variables based on palette key
function getPaletteVariables(key?: string | null): Record<string, string> {
  const k = (key || "").trim().toLowerCase();
  const palettes: Record<string, any> = {
    girly: { "--bg": "#f4bbd3", "--accent": "#fe5d9f", "--text": "#2b1f24" },
    fiesta: { "--bg": "#1729ae", "--accent": "#fe20e8", "--text": "#ffffff" },
    zen: { "--bg": "#f8e9dc", "--accent": "#43691b", "--text": "#1f2a1b" },
    classy: { "--bg": "#03172f", "--accent": "#efd466", "--text": "#fff7b6" },
    spicy: { "--bg": "#656c12", "--accent": "#ecc216", "--text": "#ffffff" },
  };
  return palettes[k] || palettes.zen;
}

export default function PreviewClient({
  slug,
  mt,
  event,
}: {
  slug: string;
  mt: string;
  event: EventSummary;
}) {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrOpen, setQrOpen] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.protocol}//${window.location.host}/e/${slug}`;
  }, [slug]);

  const whenLine = useMemo(() => 
    event.starts_at ? formatFriendlyDateAtTime(event.starts_at) : ""
  , [event.starts_at]);

  const shareText = useMemo(() => {
    const host = event.host_name?.trim() || "You’re invited";
    const title = event.title?.trim() ? ` to ${event.title}` : "";
    return `${shareUrl} Yippee! ${host}${title}. Click here to RSVP.`;
  }, [shareUrl, event.host_name, event.title]);

  useEffect(() => {
    if (qrOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, { margin: 1, width: 200 }).then(setQrDataUrl);
    }
  }, [shareUrl, qrOpen]);

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        router.push(`/m/${mt}`);
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Invite link copied!");
      }
    } catch (e) { /* ignore cancel */ }
  }

  const paletteStyles = useMemo(() => getPaletteVariables(event.gif_key), [event.gif_key]);

  return (
    <Shell title="Ready to share" paletteKey={null}>
      <div className="c-stack">
        {/* Themed Preview Area */}
        <div 
          className="c-card" 
          style={{ 
            ...paletteStyles as any,
            backgroundColor: "var(--bg)", 
            padding: "var(--space-2)",
            border: "none" 
          }}
        >
          <div className="c-card" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
            <InviteCard 
              slug={slug} 
              event={event} 
              mode="preview" 
              editHref={`/m/${mt}/edit`}
              showHeaderInCard 
              headerWhenLine={whenLine} 
            />
          </div>
        </div>

        {/* Primary Actions */}
        <div className="c-stack" style={{ gap: "var(--space-2)" }}>
          <button className="c-btnPrimary" onClick={handleShare}>
            Share with guests
          </button>
          
          <a href={`/m/${mt}/calendar.ics`} className="c-btnSecondary">
            Add to my calendar
          </a>
        </div>

        {/* Utilities */}
        <div className="c-divider" />
        
        <details className="c-section" onToggle={(e) => setQrOpen((e.currentTarget as any).open)}>
          <summary className="c-btnGhost" style={{ textAlign: 'center' }}>Show QR code</summary>
          {qrDataUrl && (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: "var(--space-3)" }}>
              <img src={qrDataUrl} alt="QR" className="c-card" style={{ width: 180, padding: 10 }} />
            </div>
          )}
        </details>
      </div>
    </Shell>
  );
}