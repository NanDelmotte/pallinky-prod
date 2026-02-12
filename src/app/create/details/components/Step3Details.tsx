// src/app/create/details/components/Step3Details.tsx
"use client";

import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";

export function Step3Details({ draft, action, backHref, hiddenInputs }: { draft: any; action: any; backHref: string; hiddenInputs: any }) {
  return (
    <form action={action} className="c-stack" style={{ display: "flex", flexDirection: "column", minHeight: 360 }}>
      {hiddenInputs}
      <label className="c-field">
        <textarea
          name="description"
          defaultValue={draft.description || ""}
          rows={5}
          placeholder="I thought it would be fun..."
          className="c-textarea"
          autoFocus
        />
        <div className="c-help">We'll include this in the invite.</div>
      </label>
      <details className="c-section">
        <summary className="c-btnLink"> Add location</summary>
        <div style={{ marginTop: 10 }}>
          <input name="location" defaultValue={draft.location || ""} placeholder="e.g. My place" className="c-input" />
        </div>
      </details>
      <div style={{ flex: 1 }} />
      <BottomNav
        left={<ArrowNav dir="left" kind="link" href={backHref} ariaLabel="Back" />}
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Continue" disableWhenInvalid={false} />}
      />
    </form>
  );
}