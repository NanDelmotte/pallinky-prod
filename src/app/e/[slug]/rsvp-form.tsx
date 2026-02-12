"use client";

import { useState } from "react";
import { getOrSetGuestTokenCookie } from "@/lib/guestTokenClient";
import { submitRsvpAction } from "./actions";

interface RsvpFormProps {
  slug: string;
  disabled: boolean;
  token?: string; 
}

export default function RsvpForm({ slug, disabled, token }: RsvpFormProps) {
  const [status, setStatus] = useState<"yes" | "maybe" | "no">("yes");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);

    if (!name.trim()) {
      setErr("Please add your name.");
      return;
    }

    // Email is now mandatory and requires an @ symbol
    if (!email.trim() || !email.includes("@")) {
      setErr("Please add a valid email address.");
      return;
    }

    setBusy(true);
    try {
      const guestToken = token || getOrSetGuestTokenCookie();

      const result = await submitRsvpAction({
        p_slug: slug,
        p_status: status,
        p_name: name.trim(),
        p_email: email.trim(),
        p_message: message.trim() || null,
        p_guest_token: guestToken || null,
      });

      if (result?.error) {
        setErr(result.error);
        return;
      }

      window.location.href = `/e/${slug}/thanks?status=${encodeURIComponent(status)}`;
    } catch (e) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="c-stack">
      <div className="c-field">
        <div className="c-label">RSVP</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {(["yes", "maybe", "no"] as const).map((s) => (
            <button
              key={s}
              type="button"
              disabled={disabled || busy}
              onClick={() => setStatus(s)}
              className={status === s ? "c-choice c-choice--active" : "c-choice"}
            >
              {s === "yes" ? "Going" : s === "maybe" ? "Maybe" : "No"}
            </button>
          ))}
        </div>
      </div>

      <div className="c-field">
        <div className="c-label">Your name</div>
        <input
          disabled={disabled || busy}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jane Doe"
          className="c-input"
        />
      </div>

      <div className="c-field">
        <div className="c-label">Email</div>
        <input
          disabled={disabled || busy}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="c-input"
          required
        />
      </div>

      <div className="c-field">
        <div className="c-label">Message (optional)</div>
        <textarea
          disabled={disabled || busy}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Anything the host should know?"
          rows={3}
          className="c-textarea"
        />
      </div>

      {err ? <div className="c-error">{err}</div> : null}

      <button className="c-btnPrimary" disabled={disabled || busy} onClick={submit}>
        {busy ? "Sending…" : "Send RSVP"}
      </button>
    </section>
  );
}