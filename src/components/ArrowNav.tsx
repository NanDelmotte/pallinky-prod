// src/components/ArrowNav.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  dir: "left" | "right";
  kind?: "submit" | "link";
  href?: string; // required when kind="link"
  ariaLabel: string;
  disableWhenInvalid?: boolean; // only used for submit
  disabled?: boolean; // only used for link (rare)
};

export default function ArrowNav({
  dir,
  kind = "submit",
  href,
  ariaLabel,
  disableWhenInvalid = true,
  disabled = false,
}: Props) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(
    kind === "submit" ? disableWhenInvalid : disabled
  );

  useEffect(() => {
    if (kind !== "submit") return;

    const btn = btnRef.current;
    const form = btn?.closest("form");
    if (!btn || !form) return;

    const sync = () => {
      if (!disableWhenInvalid) {
        setIsDisabled(false);
        return;
      }
      setIsDisabled(!form.checkValidity());
    };

    sync();

    const onAnyChange = () => sync();
    form.addEventListener("input", onAnyChange, true);
    form.addEventListener("change", onAnyChange, true);

    return () => {
      form.removeEventListener("input", onAnyChange, true);
      form.removeEventListener("change", onAnyChange, true);
    };
  }, [kind, disableWhenInvalid]);

  const glyph = dir === "left" ? "←" : "→";

  const commonStyle: React.CSSProperties = {
    width: 52,
    height: 52,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    lineHeight: 1,
    padding: 0,
    textDecoration: "none",
  };

  if (kind === "link") {
    if (!href) throw new Error("ArrowNav: href is required when kind='link'");

    return (
      <a
        href={href}
        className="c-btnPrimary"
        aria-label={ariaLabel}
        style={{
          ...commonStyle,
          pointerEvents: disabled ? "none" : "auto",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {glyph}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type="submit"
      className="c-btnPrimary"
      aria-label={ariaLabel}
      disabled={isDisabled}
      style={commonStyle}
    >
      {glyph}
    </button>
  );
}
