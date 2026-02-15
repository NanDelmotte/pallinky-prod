// src/app/create/details/components/Step1What.tsx

import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";

export function Step1What({ draft, action }: { draft: any; action: any }) {
  return (
    <form 
      action={action} 
      className="c-stack" 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "var(--space-4)" // Explicit gap instead of stretching the height
      }}
    >
      <input
        name="title"
        required
        defaultValue={draft.title || ""}
        placeholder="Karaoke night - coffee catch up ..."
        className="c-input"
        autoFocus
      />
      
      {/* REMOVED: <div style={{ flex: 1 }} /> 
          This was pushing the BottomNav to the very bottom of the screen.
      */}

      <BottomNav 
        right={<ArrowNav dir="right" kind="submit" ariaLabel="Continue" />} 
      />
    </form>
  );
}