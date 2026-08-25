// Service worker dédié uniquement aux notifications push (pas de cache, pas de PWA).

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (e) {
    payload = { title: "Boboh House Media", body: event.data ? event.data.text() : "" };
  }

  const title = payload.title || "Boboh House Media";
  const options = {
    body: payload.body || "Un nouvel article vient d'être publié.",
    icon: "/logo.png",
    badge: "/favicon.ico",
    image: payload.image || undefined,
    tag: payload.url || "boboh-article",
    data: { url: payload.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === target && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
