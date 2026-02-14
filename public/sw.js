/* public/sw.js */

// This forces the worker to activate immediately without waiting for a page reload
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// This ensures the worker takes control of the page as soon as it's active
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/apple-icon.png',
    badge: '/icon-512.png',
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});