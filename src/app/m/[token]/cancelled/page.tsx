// src/app/m/[token]/ended/page.tsx
import Link from "next/link";
import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function ManageEnded({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createSupabaseServer();
  const { data } = await supabase.rpc("get_event_by_manage_token", {
    p_manage_token: params.token,
  });

  const e = data?.[0];

  if (!e) {
    return (
      <Shell title="Event not found">
        <div className="c-stack">
          <div className="c-help">
            This link doesn’t match an event.
          </div>

          <Link href="/create" className="c-btnPrimary">
            Create a new event
          </Link>
        </div>
      </Shell>
    );
  }

  const isCancelled = e.status === "cancelled";
  const isExpired = e.status === "expired";

  // Guard: this page is only for terminal states
  if (!isCancelled && !isExpired) {
    // Active events should never land here
    return (
      <Shell title="You’re hosting">
        <Link href={`/m/${params.token}`} className="c-btnPrimary">
          Go to event
        </Link>
      </Shell>
    );
  }

  return (
    <Shell
      title={isCancelled ? "Event cancelled" : "Event ended"}
      subtitle={
        isCancelled
          ? "This event is no longer happening."
          : "This event has already taken place."
      }
    >
      <div className="c-stack">
        <section className="c-section">
          <div style={{ fontWeight: 700, fontSize: 18 }}>
            {e.title}
          </div>

          <div className="c-help" style={{ marginTop: 6 }}>
            {isCancelled
              ? "Guests are no longer be able to RSVP."
              : "RSVPs are now closed."}
          </div>
        </section>

        <section className="c-section">
          <Link href="/create/details" className="c-btnPrimary">
            Create a new event
          </Link>

          <div className="c-help">
            Creating a new event won’t affect past ones.
          </div>
        </section>
      </div>
    </Shell>
  );
}
