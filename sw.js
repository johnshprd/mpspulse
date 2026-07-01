// MPS Pulse Service Worker
const CACHE_NAME = 'mps-pulse-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', event => {
  let data = {
    title: 'MPS Pulse ⚡',
    body: 'Your MPS window has closed. Time for your next pulse!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: { url: '/app.html' }
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch(e) {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      vibrate: [200, 100, 200],
      data: data.data,
      requireInteraction: false
    })
  );
});

// Handle notification click — open or focus the app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/app.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes('mpspulse.app') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
