// src/app/create/details/components/Step2When.tsx
"use client";

import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";
import DecideLaterGo from "../decide-later";

export function Step2When({ draft, action, backHref, hiddenInputs }: { draft: any; action: any; backHref: string; hiddenInputs: any }) {
  
  // Define a shared style object to ensure pixel-perfect consistency
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    height: '56px', // Standard height for all form elements
    fontSize: '16px',
    padding: '0 16px',
    borderRadius: '12px',
    border: '1px solid rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(255,255,255,0.5)',
    boxSizing: 'border-box',
    appearance: 'none', // Removes default iOS styling
    WebkitAppearance: 'none'
  };

  return (
    <form 
      action={action} 
      className="c-stack" 
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
    >
      {hiddenInputs}
      <input type="hidden" name="decide_later" value="" />
      
      <label className="c-field">
        <span className="c-label">When is it?</span>
        <div style={{ position: 'relative' }}>
          <input
            name="starts_at"
            type="datetime-local"
            lang="en-GB" 
            onClick={(e) => e.currentTarget.showPicker?.()}
            required
            defaultValue={draft.starts_at || ""}
            className="c-input datetime-input"
            autoFocus
            style={fieldStyle}
            data-placeholder="Select date & time"
          />
        </div>
      </label>

      <label className="c-field">
        <span className="c-label">How long?</span>
        <div style={{ position: 'relative' }}>
          <select 
            name="duration_minutes" 
            defaultValue={draft.duration_minutes || "0"} 
            className="c-select"
            style={fieldStyle}
          >
            <option value="0">No end time</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">1 hour</option>
            <option value="120">2 hours</option>
            <option value="180">3 hours</option>
          </select>
          {/* Custom chevron to replace the removed default appearance */}
          <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.5 }}>
            ▼
          </div>
        </div>
      </label>

      <DecideLaterGo />
      
      <BottomNav
        left={<ArrowNav dir="left" kind="link" href={backHref} ariaLabel="Back" />}
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Continue" />}
      />

      <style jsx>{`
        .datetime-input:not(:valid)::before {
          content: attr(data-placeholder);
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text);
          opacity: 0.4;
          pointer-events: none;
        }
        .datetime-input:valid::before { display: none; }

        /* Standardize the datetime-local internal layout */
        input::-webkit-datetime-edit { padding: 0; }
        input::-webkit-calendar-picker-indicator {
          position: absolute;
          right: 12px;
          opacity: 0.5;
        }
      `}</style>
    </form>
  );
}