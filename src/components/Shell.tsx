/**
 * Path: src/components/Shell.tsx
 */
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  paletteKey?: string | null;
};

const PALETTES: Record<string, any> = {
  "palette-girly": { "--bg": "#f4bbd3", "--accent": "#fe5d9f", "--text": "#2b1f24", "--surface-strong": "#ffffff" },
  "palette-fiesta": { "--bg": "#1729ae", "--accent": "#fe20e8", "--text": "#ffffff", "--surface-strong": "rgba(255,255,255,0.15)" },
  "palette-zen": { "--bg": "#f8e9dc", "--accent": "#43691b", "--text": "#1f2a1b", "--surface-strong": "#ffffff" },
  "palette-classy": { "--bg": "#03172f", "--accent": "#efd466", "--text": "#fff7b6", "--surface-strong": "rgba(255,255,255,0.12)" },
  "palette-spicy": { "--bg": "#656c12", "--accent": "#ecc216", "--text": "#ffffff", "--surface-strong": "rgba(255,255,255,0.15)" },
};

export default function Shell({ title, subtitle, backHref, backLabel = "Back", children, paletteKey }: Props) {
  const [liveKey, setLiveKey] = useState(paletteKey);

  useEffect(() => {
    // Determine the current palette
    const key = liveKey?.startsWith("palette-") ? liveKey : `palette-${liveKey || "zen"}`;
    const styles = PALETTES[key] || PALETTES["palette-zen"];
    
    // Inject variables into the document root so globals.css can access them
    Object.entries(styles).forEach(([prop, val]) => {
      document.documentElement.style.setProperty(prop, val as string);
    });

    function onVibe(e: Event) {
      const ce = e as CustomEvent<{ gifKey?: string | null }>;
      setLiveKey(ce.detail?.gifKey ? `palette-${ce.detail.gifKey}` : "palette-zen");
    }
    
    window.addEventListener("cirklie:vibe", onVibe as EventListener);
    return () => window.removeEventListener("cirklie:vibe", onVibe as EventListener);
  }, [liveKey]);

  return (
    <main className="c-page">
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px', width: '100%' }}>
        <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
          {backHref && (
            <Link href={backHref} style={{ color: 'var(--text)', textDecoration: 'none', fontSize: '14px' }}>
              ← {backLabel}
            </Link>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          {title && <h1 style={{ color: 'var(--text)', margin: 0, fontSize: '24px', fontWeight: 700 }}>{title}</h1>}
          {subtitle && <p style={{ color: 'var(--text)', opacity: 0.6, margin: '4px 0 0 0', fontSize: '14px' }}>{subtitle}</p>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children}
        </div>
        
        <div style={{ height: '150px' }} aria-hidden="true" />
      </div>

      <style jsx global>{`
        html, body {
          background-color: var(--bg);
          color: var(--text);
          margin: 0;
          padding: 0;
          transition: background-color 0.3s ease;
        }
        .c-page {
          min-height: 100vh;
          width: 100%;
        }
      `}</style>
    </main>
  );
}