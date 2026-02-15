/**
 * Path: src/app/my-events/page.tsx
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Shell from "@/components/Shell";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function MyEventsPage() {
  const [hosted, setHosted] = useState<any[]>([]);
  const [attending, setAttending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function fetchAllData() {
      // 1. Identify Guest Tokens from Cookies
      const guestTokens: Record<string, string> = {};
      document.cookie.split(';').forEach(c => {
        const [key, val] = c.trim().split('=');
        if (key.startsWith('guest_token_')) {
          guestTokens[key.replace('guest_token_', '')] = val;
        }
      });

      const email = localStorage.getItem("pallinky_host_email");
      const slugsAttending = Object.keys(guestTokens);

      // 2. Fetch Hosted Events
      let hostedData: any[] = [];
      if (email) {
        const { data } = await supabase.rpc("get_host_dashboard_by_email", { p_email: email });
        hostedData = data || [];
      }

      // 3. Fetch Attending Events
      let attendingData: any[] = [];
      if (slugsAttending.length > 0) {
        const { data } = await supabase
          .from("events")
          .select("title, slug, starts_at, host_name")
          .in("slug", slugsAttending);
        attendingData = data || [];
      }

      setHosted(hostedData);
      setAttending(attendingData);
      setLoading(false);
    }

    fetchAllData();
  }, [supabase]);

  if (loading) return <Shell title="My Events" subtitle="Loading..." children={<div className="c-help">Searching...</div>} />;

  return (
    <Shell title="My Events" subtitle="Your social calendar">
      <div className="c-stack" style={{ gap: 'var(--space-5)' }}>
        
        {/* SECTION: HOSTING */}
        <section className="c-stack">
          <div className="c-sectionTitle">Hosting ({hosted.length})</div>
          {hosted.length > 0 ? hosted.map(e => (
            <EventCard 
              key={e.id} 
              title={e.title} 
              subtitle={`${e.rsvp_count} RSVPs`}
              href={`/m/${e.manage_handle}`}
              actionLabel="Manage"
            />
          )) : <div className="c-help">No active events hosted.</div>}
        </section>

        {/* SECTION: ATTENDING */}
        <section className="c-stack">
          <div className="c-sectionTitle">Attending ({attending.length})</div>
          {attending.length > 0 ? attending.map(e => (
            <EventCard 
              key={e.slug} 
              title={e.title} 
              subtitle={`Hosted by ${e.host_name || 'a friend'}`}
              href={`/e/${e.slug}/details`}
              actionLabel="View Invite"
            />
          )) : <div className="c-help">No upcoming invites.</div>}
        </section>

        <Link href="/create" className="c-btnPrimary">+ Create new event</Link>
      </div>
    </Shell>
  );
}

function EventCard({ title, subtitle, href, actionLabel }: { title: string; subtitle: string; href: string; actionLabel: string }) {
  return (
    <div style={{ 
      border: '1px solid var(--border)', 
      borderRadius: 'var(--radius-lg)', 
      padding: 'var(--space-3)',
      backgroundColor: 'var(--surface-strong)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
        <div style={{ fontSize: 13, opacity: 0.6 }}>{subtitle}</div>
      </div>
      <Link href={href} className="c-btnSecondary" style={{ padding: '8px 16px' }}>
        {actionLabel}
      </Link>
    </div>
  );
}