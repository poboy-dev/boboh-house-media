import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export const PushNotificationToggle = () => {
  const { status, loading, enable, disable } = usePushNotifications();

  if (status === "unsupported") {
    return (
      <p className="text-xs text-muted-foreground">
        Votre navigateur ne prend pas en charge les notifications push.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-xs text-muted-foreground">
        Les notifications sont bloquées dans les réglages de votre navigateur. Autorisez-les pour ce
        site puis rechargez la page.
      </p>
    );
  }

  const enabled = status === "enabled";

  return (
    <Button
      variant={enabled ? "outline" : "default"}
      onClick={enabled ? disable : enable}
      disabled={loading}
      className="w-full"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : enabled ? (
        <BellOff className="mr-2 h-4 w-4" />
      ) : (
        <Bell className="mr-2 h-4 w-4" />
      )}
      {enabled ? "Désactiver les notifications" : "Activer les notifications"}
    </Button>
  );
};
