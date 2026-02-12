// src/app/create/details/components/Step4Create.tsx
"use client";

import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";

export function Step4Create({ draft, action, backHref, hiddenInputs }: { draft: any; action: any; backHref: string; hiddenInputs: any }) {
  return (
    <form action={action} className="c-stack" style={{ display: "flex", flexDirection: "column", minHeight: 360 }}>
      {hiddenInputs}
      <label className="c-field">
        <input name="host_name" required defaultValue={draft.host_name || ""} placeholder="Your name" className="c-input" autoFocus />
      </label>
      <label className="c-field">
        <input name="host_email" type="email" required defaultValue={draft.host_email || ""} placeholder="you@email.com" className="c-input" />
      </label>
      <div style={{ flex: 1 }} />
      <BottomNav
        left={<ArrowNav dir="left" kind="link" href={backHref} ariaLabel="Back" />}
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Create invite" />}
      />
    </form>
  );
}