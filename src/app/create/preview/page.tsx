import { redirect } from "next/navigation";
import Shell from "@/components/Shell";
import { createSupabaseServer } from "@/lib/supabase/server";
import { formatFriendlyDateAtTime } from "@/lib/time";
import PreviewClient from "./preview-client";

export async function generateMetadata({ searchParams }: { searchParams: any }) {
  const supabase = createSupabaseServer();
  const { data } = await supabase
    .from("events")
    .select("title, host_name")
    .eq("slug", searchParams.slug)
    .single();

  return {
    title: data ? `${data.host_name} invites you to ${data.title}` : "Event Invite",
  };
}

export default async function PreviewPage({ searchParams }: { searchParams: any }) {
  const slug = searchParams?.slug;
  const mt = searchParams?.mt;

  if (!slug || !mt) redirect("/create");

  const supabase = createSupabaseServer();
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !event) {
    return (
      <Shell title="Invalid link" subtitle="We couldn't find this event in our database.">
        <div className="c-stack">
          <a href="/create" className="c-btnPrimary">Create new event</a>
        </div>
      </Shell>
    );
  }

  const whenLine = event.starts_at ? formatFriendlyDateAtTime(event.starts_at) : "";

  return (
    <Shell 
      title="Ready to share" 
      subtitle={event.title}
      paletteKey="zen" // Keep the page background beige (Zen)
    >
      <PreviewClient 
        event={event} 
        slug={slug} 
        mt={mt} 
        whenLine={whenLine} 
      />
    </Shell>
  );
}