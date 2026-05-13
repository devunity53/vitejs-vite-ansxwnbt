// ═══════════════════════════════════════════════════════════════
// sw.js — Service Worker FamilyStars
// À placer à la RACINE de votre projet Vercel : /public/sw.js
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'familystars-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// ── INSTALL : mise en cache des assets ───────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// ── ACTIVATE : nettoyage des anciens caches ───────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH : stratégie network-first, fallback cache ──────────
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes Supabase / API
  if (event.request.url.includes('supabase.co') || event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses GET réussies
        if (event.request.method === 'GET' && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── PUSH NOTIFICATIONS ────────────────────────────────────────
self.addEventListener('push', (event) => {
  let data = { title: 'FamilyStars 🌟', body: 'Vous avez une nouvelle notification', icon: '/icon-192.png', badge: '/badge-72.png' };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/badge-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'familystars',
    renotify: true,
    data: { url: data.url || '/' },
    actions: data.actions || [],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ── NOTIFICATION CLICK : ouvrir l'app ────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si l'app est déjà ouverte, la mettre au premier plan
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon ouvrir une nouvelle fenêtre
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── BACKGROUND SYNC (optionnel) ───────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    // Synchronisation en arrière-plan si hors ligne
    console.log('Background sync: messages');
  }
});
