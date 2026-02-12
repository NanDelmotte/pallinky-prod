// src/components/Shell.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { paletteForGif } from "@/lib/palette";

type Props = {
  title?: string;
  subtitle?: string; // pass "1/4" etc
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  tightCard?: boolean;
  paletteKey?: string | null;
};

function applyPaletteClass(paletteKey?: string | null) {
  const el = document.documentElement;

  // clear existing palettes
  Array.from(el.classList).forEach((c) => {
    if (c.startsWith("palette-")) el.classList.remove(c);
  });

  // default to zen when nothing is provided
  const cls =
    paletteKey
      ? paletteKey.startsWith("palette-")
        ? paletteKey
        : paletteForGif(paletteKey)
      : "palette-zen";

  el.classList.add(cls);
}


export default function Shell({
  title,
  subtitle,
  backHref,
  backLabel = "Back",
  children,
  tightCard = false,
  paletteKey,
}: Props) {
  const [liveKey, setLiveKey] = useState<string | null | undefined>(paletteKey);

  useEffect(() => {
    setLiveKey(paletteKey);
  }, [paletteKey]);

  useEffect(() => {
    applyPaletteClass(liveKey);
  }, [liveKey]);

  useEffect(() => {
    function onVibe(e: Event) {
      const ce = e as CustomEvent<{ gifKey?: string | null }>;
      setLiveKey(ce.detail?.gifKey ?? null);
    }

    window.addEventListener("cirklie:vibe", onVibe as EventListener);
    return () =>
      window.removeEventListener("cirklie:vibe", onVibe as EventListener);
  }, []);

  return (
    <main className="c-page">
      <div className="c-wrap">
        {(backHref || title || subtitle) && (
          <div className="c-topbar">
            <div>
              {backHref ? (
                <Link href={backHref} className="c-back">
                  ← {backLabel}
                </Link>
              ) : null}
            </div>
            <div />
          </div>
        )}

        {(title || subtitle) && (
          <div
            style={{
              marginBottom: "var(--space-3)",
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: "var(--space-2)",
            }}
          >
            {title ? <h1 className="c-title">{title}</h1> : <span />}
            {subtitle ? (
              <span
                className="c-subtitle"
                style={{
                  margin: 0,
                  whiteSpace: "nowrap",
                  fontSize: "0.875rem",
                  opacity: 0.7,
                }}
              >
                {subtitle}
              </span>
            ) : null}
          </div>
        )}

        <div className={tightCard ? "c-card c-card--tight" : "c-card"}>
          {children}
        </div>
      </div>
    </main>
  );
}
