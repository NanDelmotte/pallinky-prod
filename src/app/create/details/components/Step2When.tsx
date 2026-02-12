// src/app/create/details/components/Step2When.tsx
"use client";

import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";
import DecideLaterGo from "../decide-later";

export function Step2When({ draft, action, backHref, hiddenInputs }: { draft: any; action: any; backHref: string; hiddenInputs: any }) {
  return (
    <form action={action} className="c-stack" style={{ display: "flex", flexDirection: "column", minHeight: 320 }}>
      {hiddenInputs}
      <input type="hidden" name="decide_later" value="" />
      
      <label className="c-field">
        <div lang="en-GB">
          <input
            name="starts_at"
            type="datetime-local"
            lang="en-GB" 
            // Change onFocus to onClick to satisfy the "user gesture" requirement
            onClick={(e) => e.currentTarget.showPicker?.()}
            required
            defaultValue={draft.starts_at || ""}
            className="c-input"
            autoFocus
            style={{ width: '100%' }}
          />
        </div>
      </label>

      <label className="c-field">
        <select name="duration_minutes" defaultValue={draft.duration_minutes || "0"} className="c-select">
          <option value="0">No end time</option>
          <option value="30">30 min</option>
          <option value="45">45 min</option>
          <option value="60">1 hour</option>
          <option value="120">2 hours</option>
          <option value="180">3 hours</option>
        </select>
      </label>

      <DecideLaterGo />
      <div style={{ flex: 1 }} />
      <BottomNav
        left={<ArrowNav dir="left" kind="link" href={backHref} ariaLabel="Back" />}
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Continue" />}
      />
    </form>
  );
}