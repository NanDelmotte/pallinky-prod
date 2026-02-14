/* src/lib/notifications.ts */
import { createSupabaseBrowser } from "./supabase/browser";

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
  
  // 1. Ensure registration is ready
  const registration = await navigator.serviceWorker.ready;
  
  // 2. Use the Hardcoded Key (Bypassing environment issues)
  const publicKey = "BPFmtF2zPcyW_WE6yhoaUte8Cp17ucLcQwoRuoOvdS9XXQLr-uzQuaxnmIXPrcbH5Pj6GY8_I9GMusJMCzbyVFo";
  
  const convertedKey = urlBase64ToUint8Array(publicKey);

  // 3. Subscribe
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedKey
  });

  // 4. Save to Database
  const { error } = await supabase.rpc('save_push_subscription', {
    p_email: email,
    p_subscription_json: subscription,
    p_user_agent: navigator.userAgent
  });

  if (error) throw error;

  return subscription;
}