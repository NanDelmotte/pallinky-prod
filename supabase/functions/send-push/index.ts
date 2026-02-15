import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import * as webpush from "https://esm.sh/web-push@3.6.1"

serve(async (req) => {
  try {
    const { record } = await req.json() // This is the new row from 'rsvps'

    webpush.setVapidDetails(
      'mailto:admin@example.com',
      Deno.env.get('VAPID_PUBLIC_KEY')!,
      Deno.env.get('VAPID_PRIVATE_KEY')!
    )

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // 1. Get the host_email from the events table using event_id
    const eventRes = await fetch(
      `${supabaseUrl}/rest/v1/events?id=eq.${record.event_id}&select=host_email,title`,
      {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      }
    )
    const eventData = await eventRes.json()
    const event = eventData[0]

    if (!event?.host_email) return new Response('Host not found', { status: 200 })

    // 2. Find the host's push subscription using their host_email
    const subRes = await fetch(
      `${supabaseUrl}/rest/v1/push_subscriptions?email_lc=eq.${event.host_email}&select=subscription_json`,
      {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
      }
    )
    const subs = await subRes.json()

    if (!subs || subs.length === 0) return new Response('No push sub', { status: 200 })

    // 3. Send the notification
    const payload = JSON.stringify({
      title: `${event.title}: New RSVP!`,
      body: `${record.name} is ${record.status === 'yes' ? 'coming!' : 'not coming.'}`,
    })

    await webpush.sendNotification(subs[0].subscription_json, payload)

    return new Response(JSON.stringify({ sent: true }), { status: 200 })
  } catch (err) {
    return new Response(err.message, { status: 500 })
  }
})