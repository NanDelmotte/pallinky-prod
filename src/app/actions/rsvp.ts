// src/app/actions/rsvp.ts
'use server'

import { createSupabaseServer } from "@/lib/supabase/server";

export async function getRsvpContext(token: string) {
  const supabase = createSupabaseServer();
  
  // 1. Detect if this is a Host RSVP
  const isHost = token.startsWith('HOST-');
  const actualToken = isHost ? token.replace('HOST-', '') : token;

  // 2. Fetch the RSVP record
  const { data: rsvp, error } = await supabase
    .from('rsvps')
    .select('*, event:events(*)')
    .eq('guest_token', token)
    .single();

  if (error || !rsvp) return { error: "RSVP not found" };

  // 3. If it's a host, we can now safely provide the management URL
  // by stripping the prefix to get the original manage_handle
  return {
    rsvp,
    isHost,
    manageUrl: isHost ? `/m/${actualToken}` : null
  };
}