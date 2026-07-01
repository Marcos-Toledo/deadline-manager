"use client";

import {
    getVapidPublicKey,
    hasPushSubscription,
    subscribePush,
    unsubscribePush,
} from "@/app/actions/notifications";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!("serviceWorker" in navigator)) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

async function subscribe(
  registration: ServiceWorkerRegistration,
  publicKey: string,
) {
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });
  return subscription.toJSON();
}

export function PushToggle() {
  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;
  const [supported] = useState(isSupported);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(isSupported);
  const [toggling, startToggling] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supported) return;
    hasPushSubscription().then((has) => {
      setSubscribed(has);
      setLoading(false);
    });
  }, [supported]);

  const handleEnable = () => {
    setError(null);
    startToggling(async () => {
      try {
        const publicKey = await getVapidPublicKey();
        if (!publicKey) {
          setError("Chave VAPID pública não configurada.");
          return;
        }

        const registration = await registerServiceWorker();
        if (!registration) {
          setError("Service worker não suportado neste navegador.");
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setError("Permissão de notificação negada.");
          return;
        }

        const subscription = await subscribe(registration, publicKey);
        const result = await subscribePush(subscription as never);
        if (result.success) {
          setSubscribed(true);
        } else {
          setError("Falha ao salvar inscrição de push.");
        }
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      }
    });
  };

  const handleDisable = () => {
    setError(null);
    startToggling(async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          await unsubscribePush(subscription.endpoint);
        }
        setSubscribed(false);
      } catch (err) {
        console.error(err);
        setError((err as Error).message);
      }
    });
  };

  if (!supported) {
    return (
      <p className="text-sm text-base-content/50">
        Push não é suportado neste navegador.
      </p>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-base-content/50">
        <Loader2 className="w-4 h-4 animate-spin" />
        Verificando push...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {subscribed ? (
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={handleDisable}
          disabled={toggling}
        >
          {toggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <BellOff className="w-4 h-4" />
          )}
          Desativar push
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-sm btn-primary"
          onClick={handleEnable}
          disabled={toggling}
        >
          {toggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bell className="w-4 h-4" />
          )}
          Ativar push
        </button>
      )}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
