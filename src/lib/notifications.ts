/* src/lib/notifications.ts */
import { createSupabaseBrowser } from "./supabase/browser";

// Helper to convert Base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToPush(email: string) {
  const supabase = createSupabaseBrowser();
  
  // 1. Register Service Worker
  await navigator.serviceWorker.register('/sw.js');
const registration = await navigator.serviceWorker.ready;
  
  // 2. Prepare the Key
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey) throw new Error("VAPID Public Key is missing from environment variables.");
  
  const convertedKey = urlBase64ToUint8Array(publicKey);

  // 3. Subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey
  });

  // 4. Save to Database via RPC
  const { error } = await supabase.rpc('save_push_subscription', {
    p_email: email,
    p_subscription_json: subscription,
    p_user_agent: navigator.userAgent
  });

  if (error) {
    console.error("Failed to save subscription to DB:", error);
    throw error;
  }

  return subscription;
}