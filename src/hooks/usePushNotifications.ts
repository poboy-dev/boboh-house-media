import { useCallback, useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Clé publique VAPID — publique par nature, sans risque côté client.
const VAPID_PUBLIC_KEY =
  "BOOsKhOBZfjsp1eFyIgy6kxH7WlhsLp3-CFZWwZVe4mR4gBW-B9WynuaoYyLKUjfSrNN570eT6WvOTLkfWgjLJ8";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
};

const arrayBufferToBase64Url = (buffer: ArrayBuffer | null) => {
  if (!buffer) return "";
  const bytes = new Uint8Array(buffer);
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return window.btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export type PushStatus = "unsupported" | "denied" | "enabled" | "disabled";

export const usePushNotifications = () => {
  const session = useSession();
  const [status, setStatus] = useState<PushStatus>("disabled");
  const [loading, setLoading] = useState(false);

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  useEffect(() => {
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration("/sw.js");
        const subscription = await registration?.pushManager.getSubscription();
        if (!cancelled) setStatus(subscription ? "enabled" : "disabled");
      } catch {
        if (!cancelled) setStatus("disabled");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isSupported, session?.user?.id]);

  const enable = useCallback(async () => {
    if (!isSupported || !session?.user?.id) return;
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "disabled");
        toast.error("Notifications refusées par le navigateur");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const existing = await registration.pushManager.getSubscription();
      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }));

      const p256dh = arrayBufferToBase64Url(subscription.getKey("p256dh"));
      const auth = arrayBufferToBase64Url(subscription.getKey("auth"));

      const { error } = await supabase.from("push_subscriptions").upsert(
        {
          user_id: session.user.id,
          endpoint: subscription.endpoint,
          p256dh,
          auth,
          user_agent: navigator.userAgent,
        },
        { onConflict: "endpoint" }
      );

      if (error) throw error;

      setStatus("enabled");
      toast.success("Notifications activées");
    } catch (error) {
      console.error("Erreur activation notifications:", error);
      toast.error("Impossible d'activer les notifications");
    } finally {
      setLoading(false);
    }
  }, [isSupported, session?.user?.id]);

  const disable = useCallback(async () => {
    if (!isSupported) return;
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      const subscription = await registration?.pushManager.getSubscription();

      if (subscription) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
        await subscription.unsubscribe();
      }

      setStatus("disabled");
      toast.success("Notifications désactivées");
    } catch (error) {
      console.error("Erreur désactivation notifications:", error);
      toast.error("Impossible de désactiver les notifications");
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  return { status, loading, enable, disable, isSupported };
};
