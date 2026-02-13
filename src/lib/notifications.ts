// src/lib/notifications.ts
export async function subscribeToPush() {
  // 1. Register Service Worker
  const registration = await navigator.serviceWorker.register('/sw.js');
  
  // 2. Wait for it to be ready
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'YBGrt0tXb_9usOafuJKsW7J8o82R8qkvCMZ3uzKKz_x1FxPvefzWUvOxSk32OflpJOzDTLzSoOhJst0--YdESSAk' // We'll generate this next
  });

  return subscription;
}