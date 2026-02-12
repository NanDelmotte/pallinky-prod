"use server";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function submitRsvpAction(params: {
  p_slug: string;
  p_status: string;
  p_name: string;
  p_email: string;
  p_message: string | null;
  p_guest_token: string | null;
}) {
  const supabase = createSupabaseServer();

  // The database RPC will now receive the mandatory email
  const { error } = await supabase.rpc("submit_rsvp", params);

  if (error) {
    // This will catch unique constraint errors if the DB is set up to block duplicate emails for one event
    return { error: error.message };
  }

  return { success: true };
}