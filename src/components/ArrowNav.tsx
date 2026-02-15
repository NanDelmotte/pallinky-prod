// src/components/ArrowNav.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  dir: "left" | "right" | "check"; // Added check glyph support
  kind?: "submit" | "link";
  href?: string;
  ariaLabel: string;
  disableWhenInvalid?: boolean;
  disabled?: boolean;
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
      setIsDisabled(disableWhenInvalid ? !form.checkValidity() : false);
    };

    sync();
    form.addEventListener("input", sync, true);
    form.addEventListener("change", sync, true);
    return () => {
      form.removeEventListener("input", sync, true);
      form.removeEventListener("change", sync, true);
    };
  }, [kind, disableWhenInvalid]);

  // Use the checkmark glyph if requested, otherwise arrows
  const glyph = dir === "check" ? "✓" : (dir === "left" ? "←" : "→");

  const commonStyle: React.CSSProperties = {
    width: 56, // Slightly larger for better touch target
    height: 56,
    borderRadius: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    fontWeight: "bold",
    cursor: isDisabled ? "default" : "pointer",
    transition: "transform 0.1s active",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" // Adds depth so it doesn't get lost
  };

  if (kind === "link") {
    return (
      <a
        href={href}
        className="c-btnPrimary"
        aria-label={ariaLabel}
        style={{
          ...commonStyle,
          pointerEvents: disabled ? "none" : "auto",
          opacity: disabled ? 0.5 : 1,
          textDecoration: "none"
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
      style={{
        ...commonStyle,
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      {glyph}
    </button>
  );
}