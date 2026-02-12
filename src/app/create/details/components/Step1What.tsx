// src/app/create/details/components/Step1What.tsx

import ArrowNav from "@/components/ArrowNav";
import { BottomNav } from "./BottomNav";

export function Step1What({ draft, action }: { draft: any; action: any }) {
  return (
    <form action={action} className="c-stack" style={{ display: "flex", flexDirection: "column", minHeight: 260 }}>
      <input
        name="title"
        required
        defaultValue={draft.title || ""}
        placeholder="Karaoke night - coffee catch up ..."
        className="c-input"
        autoFocus
      />
      <div style={{ flex: 1 }} />
      <BottomNav right={<ArrowNav dir="right" kind="submit" ariaLabel="Continue" />} />
    </form>
  );
}