// src/app/create/preview/page.tsx
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PreviewClient from "./preview-client";

function normalizeEndsForDisplay(
  startsIso: string | null | undefined,
  endsIso: string | null | undefined
): string | null {
  if (!startsIso || !endsIso) return endsIso ?? null;

  const start = new Date(startsIso).getTime();
  const end = new Date(endsIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return endsIso;

  // Hide the synthetic +1 minute "Whenever" end-time in UI.
  if (end - start <= 60_000) return null;

  return endsIso;
}

export default async function CreatePreviewPage({
  searchParams,
}: {
  searchParams: { slug?: string; mt?: string; gif_key?: string };
}) {
  const slug = searchParams.slug || "";
  const mt = searchParams.mt || "";
  const gifFromUrl = (searchParams.gif_key || "").trim() || null;

  if (!slug || !mt) {
    redirect("/create");
  }

  const supabase = createSupabaseServer();
  // We use 'mt' because it matches the 'manage_handle' in your DB
const { data: e, error } = await supabase
  .from('events')
  .select('*')
  .eq('manage_handle', mt)
  .single();

  if (!e) {
    return (
      <main style={{ maxWidth: 620, margin: "30px auto", padding: 16 }}>
        <h1>Not found</h1>
      </main>
    );
  }

  const gifKey =
    (typeof e.gif_key === "string" ? e.gif_key.trim() : "") || gifFromUrl;

  const endsAtForDisplay = normalizeEndsForDisplay(e.starts_at, e.ends_at);

  // ✅ pull host name from DB result
  const hostName = String(e.host_name || "").trim();

  return (
    <PreviewClient
      slug={slug}
      mt={mt}
      event={{
        host_name: hostName,
        title: e.title,
        description: e.description,
        starts_at: e.starts_at,
        ends_at: endsAtForDisplay,
        location: e.location,
        gif_key: gifKey,
      }}
      markSharedAction={markSharedAction}
    />
  );
}

async function markSharedAction(formData: FormData) {
  "use server";
  const mt = String(formData.get("mt") || "");
  const slug = String(formData.get("slug") || "");
  if (!mt || !slug) return;

  const supabase = createSupabaseServer();

  // Use a direct update instead of a missing RPC
  const { error } = await supabase
    .from('events')
    .update({ first_shared_at: new Date().toISOString() })
    .eq('manage_handle', mt);

  if (error) {
    console.error("Error marking as shared:", error);
  }

  // This takes the host to the live guest view they just shared
  redirect(`/e/${slug}`);
}
