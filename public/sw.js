self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();
  const { title, body, icon, data } = payload;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge: "/favicon.svg",
      data,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { url } = event.notification.data ?? {};
  if (url) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          if (clientList.length > 0) {
            return clientList[0].navigate(url).then(() => clientList[0].focus());
          }
          return clients.openWindow(url);
        }),
    );
  }
});
