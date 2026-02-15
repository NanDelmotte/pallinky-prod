// src/app/create/details/actions.ts
"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { toUTCFromLocalAmsterdam } from "@/lib/time";

// Utility to handle URL params
function setNonEmptyParams(sp: URLSearchParams, formData: FormData) {
  for (const [k, v] of formData.entries()) {
    const s = String(v).trim();
    if (s.length) sp.set(k, s);
    else sp.delete(k);
  }
}

function computeEndsAtUTCISO(startsAtLocal: string, durationMinutes: number) {
  const startsUtcIso = toUTCFromLocalAmsterdam(startsAtLocal);
  if (!startsUtcIso) return null;
  const startUtc = new Date(startsUtcIso);
  if (!isFinite(startUtc.getTime())) return null;
  const endUtc = new Date(startUtc.getTime() + durationMinutes * 60 * 1000);
  return endUtc.toISOString();
}

function slugifyLoose(input: string) {
  return input.toLowerCase().trim().replace(/['"]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

export async function step1Action(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  redirect(`/create/details?step=2&title=${encodeURIComponent(title)}`);
}

export async function step2Action(formData: FormData) {
  const startsAtLocal = String(formData.get("starts_at") || "").trim();
  const decideLater = String(formData.get("decide_later") || "").trim() === "1";
  const durationMinutes = Number(formData.get("duration_minutes") || "0");

  const endsISO = startsAtLocal && durationMinutes > 0
    ? computeEndsAtUTCISO(startsAtLocal, durationMinutes)
    : null;

  const sp = new URLSearchParams();
  sp.set("step", "3");
  setNonEmptyParams(sp, formData);
  sp.delete("decide_later");

  if (endsISO) sp.set("ends_at", endsISO);
  else sp.delete("ends_at");

  if (decideLater && !startsAtLocal) {
    sp.delete("starts_at");
    sp.delete("ends_at");
    sp.set("duration_minutes", "0");
  }

  redirect(`/create/details?${sp.toString()}`);
}

export async function step3Action(formData: FormData) {
  const sp = new URLSearchParams();
  sp.set("step", "4");
  setNonEmptyParams(sp, formData);
  redirect(`/create/details?${sp.toString()}`);
}

export async function step4CreateAction(formData: FormData) {
  const supabase = createSupabaseServer();
  const title = String(formData.get("title") || "").trim();
  const startsAtLocal = String(formData.get("starts_at") || "").trim();
  const starts_at = startsAtLocal ? toUTCFromLocalAmsterdam(startsAtLocal) : null;
  const durationMinutes = Number(formData.get("duration_minutes") || "0");
  const ends_at = startsAtLocal && durationMinutes > 0 ? computeEndsAtUTCISO(startsAtLocal, durationMinutes) : null;

  const { data, error } = await supabase.rpc("create_event_draft", {
    p_title: title,
    p_starts_at: starts_at,
    p_ends_at: ends_at,
    p_location: String(formData.get("location") || "").trim() || null,
    p_description: String(formData.get("description") || "").trim() || null,
    p_host_name: String(formData.get("host_name") || "").trim(),
    p_host_email: String(formData.get("host_email") || "").trim(),
    p_keyword: String(formData.get("keyword") || "").trim() || slugifyLoose(title) || "invite",
    p_cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
    p_gif_key: String(formData.get("gif_key") || "zen").trim() || "zen",
    p_expires_in_days: Number(formData.get("expires_in_days") || "30")
  });

  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;

  // Create a search params object to carry the data to the preview page
  const previewParams = new URLSearchParams();
  previewParams.set("slug", row.slug);
  previewParams.set("mt", row.manage_token);
  previewParams.set("host_name", String(formData.get("host_name") || ""));
  previewParams.set("title", title);
  previewParams.set("location", String(formData.get("location") || ""));
  previewParams.set("starts_at", startsAtLocal); // Using the local time string for the preview
  previewParams.set("gif_key", String(formData.get("gif_key") || "zen"));
  previewParams.set("description", String(formData.get("description") || ""));

  redirect(`/create/preview?${previewParams.toString()}`);
}