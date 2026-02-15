/**
 * Path: src/app/m/[token]/guests/page.tsx
 */

import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { formatEU } from "@/lib/time";
import { paletteForGif } from "@/lib/palette";
import { redirect } from "next/navigation";

type Row = {
  name: string;
  status: "yes" | "maybe" | "no";
  responded_at: string;
  message?: string | null;
};

export default async function ManageGuestsAndMessage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = createSupabaseServer();

  const { data: ev } = await supabase.rpc("get_event_by_manage_token", {
    p_manage_token: params.token,
  });
  const e = ev?.[0];

  if (!e) {
    return (
      <Shell title="Invalid link" subtitle="This manage link doesn’t match an event.">
        <div className="c-stack">
          <div className="c-help">Link not found.</div>
        </div>
      </Shell>
    );
  }

  const { data: list } = await supabase.rpc("get_guest_list", { p_slug: e.slug });
  const rows = (list || []) as Row[];
  
  const yes = rows.filter(r => r.status === "yes");
  const maybe = rows.filter(r => r.status === "maybe");
  const no = rows.filter(r => r.status === "no");

  const paletteKey = paletteForGif(e.gif_key ?? null);

  return (
    <Shell
      title="Guests"
      subtitle={e.title}
      backHref={`/m/${params.token}`}
      paletteKey={paletteKey}
    >
      <div className="c-stack" style={{ gap: "var(--space-5)" }}>
        
        {/* Unified Guest List */}
        <div className="c-stack">
          <Group title="Going" count={yes.length} rows={yes} />
          <Group title="Maybe" count={maybe.length} rows={maybe} />
          <Group title="No" count={no.length} rows={no} />
        </div>

        <div className="c-divider" />

        {/* Message guests */}
        <section className="c-section">
          <div className="c-sectionTitle">Message outbox</div>
          <form action={sendAction} className="c-stack">
            <input type="hidden" name="mt" value={params.token} />
            <div className="c-field">
              <div className="c-label">Subject (optional)</div>
              <input
                name="subject"
                placeholder={`Update from ${e.host_name}`}
                className="c-input"
              />
            </div>
            <div className="c-field">
              <div className="c-label">Message</div>
              <textarea name="body" required rows={4} className="c-textarea" />
            </div>
            <button className="c-btnPrimary" type="submit">
              Send message
            </button>
          </form>
        </section>
      </div>
    </Shell>
  );
}

function Group({ title, count, rows }: { title: string; count: number; rows: Row[] }) {
  return (
    <section className="c-section">
      <div className="c-sectionTitle" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{title}</span>
        <span>{count}</span>
      </div>

      <div className="c-stack" style={{ gap: "var(--space-1)" }}>
        {rows.length > 0 ? (
          rows.map((r, i) => (
            <div
              key={`${r.name}-${i}`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px",
                borderRadius: "var(--radius-md)",
                background: "var(--surface-strong)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "grid", gap: "2px" }}>
                <span style={{ fontWeight: 650, fontSize: "15px", color: "var(--text)" }}>
                  {r.name}
                </span>
                {r.message && (
                  <span style={{ fontSize: "13px", opacity: 0.7, fontStyle: "italic", color: "var(--text)" }}>
                    “{r.message}”
                  </span>
                )}
              </div>
              <span style={{ fontSize: "12px", opacity: 0.5, color: "var(--text)", whiteSpace: "nowrap" }}>
                {formatEU(r.responded_at)}
              </span>
            </div>
          ))
        ) : (
          <div style={{ padding: "14px", opacity: 0.4, fontSize: "14px", color: "var(--text)" }}>
            No one here yet
          </div>
        )}
      </div>
    </section>
  );
}

async function sendAction(formData: FormData) {
  "use server";
  const supabase = createSupabaseServer();
  const mt = String(formData.get("mt") || "");
  const subject = String(formData.get("subject") || "").trim() || null;
  const body = String(formData.get("body") || "").trim();

  await supabase.rpc("send_host_message_by_manage_token", {
    p_manage_token: mt,
    p_subject: subject,
    p_body: body,
  });

  redirect(`/m/${mt}?sent=1`);
}