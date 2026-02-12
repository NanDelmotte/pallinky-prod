// src/app/api/worker/outbox/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { formatEU, formatEURange, formatFriendlyDateAtTime } from "@/lib/time";

type Job = {
  id: string;
  recipient_email: string;
  template:
    | "host_manage_link"
    | "host_rsvp_notification"
    | "event_update"
    | "event_cancelled"
    | "host_message";
  payload: any;
  attempts: number;
};

const AMBIENT_LINES = [
  "A gentle way to include people in real life",
  "Plans don’t have to be complicated",
  "Small plans count",
  "Real life, but lighter",
  "Make space for people",
  "It’s okay to keep things informal",
  "You don’t need a big reason",
  "Inviting people can be simple",
  "Not everything has to be planned perfectly",
  "Sometimes a few people is enough",
  "Include people, gently",
  "People you know. People they know",
  "Invitations can travel",
  "Plans grow through people",
  "Friends of friends welcome",
];

function pickAmbientLine() {
  return AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)];
}

const baseUrl = process.env.NODE_ENV === 'production' 
  ? "https://pallinky.com" 
  : "http://localhost:3000";

function escapeHtml(input: any) {
  const s = String(input ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const FOOTER = "Create invites and RSVP links simply!";

function normalizeMessage(payload: any): string {
  const raw =
    payload?.body ??
    payload?.message ??
    payload?.text ??
    payload?.content ??
    payload?.note ??
    "";

  const s = String(raw ?? "").trim();
  if (s) return s;

  return "You have a new update.";
}

function formatWhen(payload: any) {
  if (!payload?.starts_at) return "";
  return payload?.ends_at
    ? formatEURange(payload.starts_at, payload.ends_at)
    : formatEU(payload.starts_at);
}

function eventLinks(payload: any) {
  const slug = payload?.slug ? String(payload.slug) : "";
  const manageToken = payload?.manage_token ? String(payload.manage_token) : "";

  const manageUrl =
    payload?.manage_url && String(payload.manage_url).startsWith("http")
      ? String(payload.manage_url)
      : manageToken
      ? `${baseUrl}/m/${encodeURIComponent(manageToken)}`
      : "";

  const rsvpUrl = slug ? `${baseUrl}/e/${encodeURIComponent(slug)}` : "";
  const detailsUrl = slug
    ? `${baseUrl}/e/${encodeURIComponent(slug)}/details`
    : "";

  return { rsvpUrl, detailsUrl, manageUrl };
}

function wrapHtml(opts: {
  title: string;
  intro?: string;
  bodyHtml?: string;
  ctas?: { label: string; href: string }[];
  footer?: string;
}) {
  const { title, intro, bodyHtml, ctas = [], footer } = opts;

  const ctaHtml = ctas
    .filter((c) => c.href)
    .map(
      (c) => `
        <tr>
          <td style="padding: 0 0 10px 0;">
            <a href="${escapeHtml(c.href)}"
               style="display:inline-block;text-decoration:none;padding:10px 14px;border-radius:10px;border:1px solid #e5e7eb;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111827;">
              ${escapeHtml(c.label)}
            </a>
          </td>
        </tr>
      `
    )
    .join("");

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ffffff;">
      <tr>
        <td align="center" style="padding:24px 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;">
            <tr>
              <td style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                <div style="font-size:18px;font-weight:600;line-height:1.3;margin:0 0 12px 0;">
                  ${escapeHtml(title)}
                </div>

                ${
                  intro
                    ? `<div style="font-size:14px;line-height:1.6;margin:0 0 14px 0;color:#374151;">
                        ${escapeHtml(intro)}
                      </div>`
                    : ""
                }

                ${
                  bodyHtml
                    ? `<div style="font-size:14px;line-height:1.7;margin:0 0 16px 0;color:#111827;">
                        ${bodyHtml}
                      </div>`
                    : ""
                }

                ${
                  ctaHtml
                    ? `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:6px 0 6px 0;">
                        ${ctaHtml}
                      </table>`
                    : ""
                }

                <div style="border-top:1px solid #e5e7eb;margin:18px 0 0 0;padding:14px 0 0 0;">
                  <div style="font-size:12px;line-height:1.5;color:#6b7280;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
                    ${escapeHtml(footer || FOOTER)}
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();
}

function renderHostManageLink(payload: any) {
  const title = String(payload?.event_title || "Your event").trim();
  const eventDateIso = payload?.event_date ? String(payload.event_date) : "";
  const manageUrl = payload?.manage_url ? String(payload.manage_url) : "";
  const when = formatFriendlyDateAtTime(eventDateIso);

  const subject = `Woohoo you created an event: ${title}${
    when ? ` on ${when}` : ""
  }`;

  const byline = pickAmbientLine();

  const bodyHtml = `
  <div style="text-align:center;margin:8px 0 10px 0;font-size:28px;font-weight:700;line-height:1.15;">
    Bravissimo! You just made a plan.
  </div>

  <div style="
    text-align:center;
    margin:0 0 18px 0;
    font-size:14px;
    line-height:1.6;
    font-style:italic;
    color:#4F46E5;
  ">
    Let’s get social — ${escapeHtml(byline)}
  </div>

  <div style="
    text-align:center;
    margin:0 0 14px 0;
    font-size:14px;
    color:#374151;
  ">
    You can always come back via this link.
  </div>
`.trim();

  const html = wrapHtml({
    title: "",
    bodyHtml,
    ctas: manageUrl
      ? [{ label: "See who’s coming", href: manageUrl }]
      : [],
    footer: FOOTER,
  });

  const text = [
    "Bravissimo! You just made a plan.",
    "",
    "See who’s coming:",
    manageUrl,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, text, html };
}

function renderHostRsvpNotification(payload: any) {
  const title = String(payload?.event_title || "Your event").trim();
  const guestName = String(payload?.guest_name || "A guest").trim();
  const response = String(payload?.response || "").trim();
  const manageUrl = payload?.manage_url ? String(payload.manage_url) : "";
  const responseLabel = response ? response.toUpperCase() : "UPDATED";

  const subject = `${responseLabel}: ${guestName} — ${title}`;

  const bodyHtml = `
    <div style="margin:0 0 12px 0;">Hi,</div>
    <div style="margin:0 0 12px 0;">
      <strong>${escapeHtml(guestName)}</strong> responded: <strong>${escapeHtml(
    response || "updated"
  )}</strong>
    </div>
    <div style="margin:0 0 8px 0;">Manage your guest list here:</div>
    <div style="white-space:pre-wrap;">
      <a href="${escapeHtml(manageUrl)}">${escapeHtml(manageUrl)}</a>
    </div>
  `.trim();

  const html = wrapHtml({
    title: `RSVP: ${title}`,
    bodyHtml,
    ctas: manageUrl ? [{ label: "Open guest list", href: manageUrl }] : [],
    footer: FOOTER,
  });

  return { subject, text: `${guestName} responded ${response}`, html };
}

function renderHostMessage(payload: any) {
  const title = payload?.event_title || payload?.title || "Your event";
  const host = payload?.host_name || "The host";
  const guest = payload?.guest_name || payload?.guest || "";
  const message = normalizeMessage(payload);
  const { manageUrl, detailsUrl, rsvpUrl } = eventLinks(payload);

  const subject = payload?.subject || `Message from ${host}: ${title}`;

  const bodyHtml = `
    <div style="margin:0 0 10px 0;"><strong>${escapeHtml(host)}</strong> sent you a message about <strong>${escapeHtml(
    title
  )}</strong>:</div>
    <div style="white-space:pre-wrap;">${escapeHtml(message)}</div>
  `.trim();

  const html = wrapHtml({
    title: `Message about “${title}”`,
    intro: guest ? `Hi ${guest},` : "Hi,",
    bodyHtml,
    ctas: [
      rsvpUrl ? { label: "RSVP", href: rsvpUrl } : undefined,
      detailsUrl ? { label: "View details", href: detailsUrl } : undefined,
      manageUrl ? { label: "Manage event", href: manageUrl } : undefined,
    ].filter(Boolean) as any,
    footer: FOOTER,
  });

  return { subject, text: message, html };
}

function renderEventUpdate(payload: any) {
  const title = payload?.event_title || payload?.title || "Your event";
  const guest = payload?.guest_name || payload?.guest || "";
  const summary = normalizeMessage(payload);
  const { manageUrl, detailsUrl, rsvpUrl } = eventLinks(payload);

  const subject = payload?.subject || `Event update: ${title}`;

  const bodyHtml = `
    <div style="margin:0 0 10px 0;">There’s an update for <strong>${escapeHtml(
      title
    )}</strong>.</div>
    <div style="white-space:pre-wrap;">${escapeHtml(summary)}</div>
  `.trim();

  const html = wrapHtml({
    title: `Update for “${title}”`,
    intro: guest ? `Hi ${guest},` : "Hi,",
    bodyHtml,
    ctas: [
      detailsUrl ? { label: "View details", href: detailsUrl } : undefined,
      rsvpUrl ? { label: "RSVP", href: rsvpUrl } : undefined,
      manageUrl ? { label: "Manage event", href: manageUrl } : undefined,
    ].filter(Boolean) as any,
    footer: FOOTER,
  });

  return { subject, text: summary, html };
}

function renderEventCancelled(payload: any) {
  const title = payload?.title || payload?.event_title || "This event";
  const host = payload?.host_name || "The host";
  const { detailsUrl } = eventLinks(payload);

  const bodyHtml = `
    <div style="margin:0 0 10px 0;">Unfortunately, this event has been cancelled.</div>
    <div style="margin:0 0 12px 0;"><strong>${escapeHtml(host)}</strong> cancelled <strong>${escapeHtml(
    title
  )}</strong>.</div>
  `.trim();

  const html = wrapHtml({
    title: `Cancelled: “${title}”`,
    bodyHtml,
    ctas: detailsUrl ? [{ label: "Create your own event", href: detailsUrl }] : [],
    footer: FOOTER,
  });

  return {
    subject: `Update: ${title} is cancelled`,
    text: `${host} cancelled ${title}`,
    html,
  };
}

export async function POST(request: Request) {
  const secret = request.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    }
  );

  const resend = new Resend(process.env.RESEND_API_KEY!);

  const { data, error } = await supabase.rpc("get_pending_outbox", { p_limit: 50 });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const jobs = (data || []) as Job[];
  if (jobs.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, failed: 0 });
  }

  let sent = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      const payload = job.payload || {};
      let rendered: { subject: string; text: string; html?: string };

      if (job.template === "host_manage_link") {
        rendered = renderHostManageLink(payload);
      } else if (job.template === "host_rsvp_notification") {
        rendered = renderHostRsvpNotification(payload);
      } else if (job.template === "event_cancelled") {
        rendered = renderEventCancelled(payload);
      } else if (job.template === "host_message") {
        rendered = renderHostMessage(payload);
      } else {
        rendered = renderEventUpdate(payload);
      }

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Pallinky <notifications@pallinky.com>",
        to: job.recipient_email,
        subject: rendered.subject,
        text: rendered.text,
        html: rendered.html,
      });

      await supabase.rpc("mark_outbox_sent", { p_id: job.id });
      sent++;
    } catch (err: any) {
      console.error("Worker error for job", job.id, err);
      await supabase.rpc("mark_outbox_failed", {
        p_id: job.id,
        p_error: err?.message || "send failed",
      });
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}