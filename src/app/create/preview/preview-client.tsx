// src/app/create/preview/preview-client.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import InviteCard from "@/components/InviteCard";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PreviewClient({ 
  event, 
  slug, 
  mt, 
  whenLine 
}: { 
  event: any; 
  slug: string; 
  mt: string; 
  whenLine: string; 
}) {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [qrOpen, setQrOpen] = useState(false);

  // Local theme mapping to ensure the card "owns" its colors 
  // regardless of the Shell's background.
  const cardTheme = useMemo(() => {
    const k = (event.gif_key || "zen").trim().toLowerCase();
    const palettes: Record<string, any> = {
      girly: { 
        "--box-bg": "#f4bbd3", 
        "--button-bg": "#fe5d9f", 
        "--text": "#2b1f24", 
        "--button-txt": "#ffffff" 
      },
      fiesta: { 
        "--box-bg": "#1729ae", 
        "--button-bg": "#fe20e8", 
        "--text": "#ffffff", 
        "--button-txt": "#ffffff" 
      },
      zen: { 
        "--box-bg": "#f8e9dc", 
        "--button-bg": "#43691b", 
        "--text": "#1f2a1b", 
        "--button-txt": "#ffffff" 
      },
      classy: { 
        "--box-bg": "#03172f", 
        "--button-bg": "#efd466", 
        "--text": "#fff7b6", 
        "--button-txt": "#03172f" 
      },
      spicy: { 
        "--box-bg": "#656c12", 
        "--button-bg": "#ecc216", 
        "--text": "#ffffff", 
        "--button-txt": "#000000" 
      },
    };
    return palettes[k] || palettes.zen;
  }, [event.gif_key]);

  useEffect(() => {
    if (event.host_email) {
      localStorage.setItem('pallinky_host_email', event.host_email);
    }
  }, [event.host_email]);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.protocol}//${window.location.host}/e/${slug}`;
  }, [slug]);

  const shareText = useMemo(() => {
    const host = event.host_name?.trim() || "Someone";
    const inviteAction = event.title?.trim() ? `is inviting you to ${event.title}` : "is inviting you";
    return `Yippee! ${host} ${inviteAction}. Click here to RSVP: ${shareUrl}`;
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

  return (
    <div className="c-stack">
      {/* Inject the theme variables here. 
        InviteCard will now use these locally defined colors.
      */}
      <div style={{ ...cardTheme as any }}>
        <InviteCard 
          slug={slug} 
          event={event} 
          mode="preview" 
          editHref={`/m/${mt}/edit`}
          showHeaderInCard 
          headerWhenLine={whenLine} 
        />
      </div>

      <div className="c-stack" style={{ gap: "var(--space-2)" }}>
        <button className="c-btnPrimary" onClick={handleShare}>
          Share with guests
        </button>
        
        {event.starts_at && (
          <a href={`/m/${mt}/calendar.ics`} className="c-btnSecondary" style={{ textAlign: 'center' }}>
            Add to my calendar
          </a>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
        <Link href="/my-events" className="c-help" style={{ textDecoration: 'underline' }}>
          View all my events
        </Link>
      </div>

      <div className="c-divider" />
      
      <details className="c-section" onToggle={(e) => setQrOpen((e.currentTarget as any).open)}>
        <summary className="c-btnGhost" style={{ textAlign: 'center' }}>Show QR code</summary>
        {qrDataUrl && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "var(--space-3)" }}>
            <img src={qrDataUrl} alt="QR" className="c-card" style={{ width: 180, padding: 10, background: "white" }} />
          </div>
        )}
      </details>
    </div>
  );
}