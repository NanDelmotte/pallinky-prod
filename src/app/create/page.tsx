import { redirect } from "next/navigation";
import Link from "next/link";
import Shell from "@/components/Shell";
import { paletteForGif } from "@/lib/palette";

export default function CreatePage() {
  const paletteKey = paletteForGif(null); // default = zen

  return (
    <Shell
      title="Create an invite"
      subtitle="Under a minute. No login."
      paletteKey={paletteKey}
    >
      <div className="c-stack">
        <a href="/create/details?step=1" className="c-btnPrimary">
          Start
        </a>

        {/* 🟢 Shortcut for returning hosts */}
        <Link 
          href="/my-events" 
          className="c-btnSecondary" 
          style={{ justifyContent: 'center', marginTop: 'var(--space-2)' }}
        >
          View my existing events
        </Link>
      </div>
    </Shell>
  );
}