import { Bell, BellRing, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * CTA affiché à la fin de chaque publication pour inciter à activer
 * les notifications push sans quitter l'article.
 */
export const NotifyArticleCTA = () => {
  const session = useSession();
  const { status, loading, enable } = usePushNotifications();

  if (status === "unsupported") return null;

  const enabled = status === "enabled";

  return (
    <aside className="my-10 rounded-2xl border border-border bg-muted/40 p-6 sm:p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {enabled ? <Check className="h-6 w-6" /> : <BellRing className="h-6 w-6" />}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        {enabled ? "Vous êtes bien abonné !" : "Ne manquez aucun article"}
      </h2>
      <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-xl mx-auto">
        {enabled
          ? "Vous recevrez une notification dès la publication d'un nouvel article."
          : "Activez les notifications et soyez alerté dès qu'une nouvelle publication arrive sur BOBOH HOUSE MEDIA."}
      </p>

      {enabled ? null : status === "denied" ? (
        <p className="text-xs text-muted-foreground">
          Les notifications sont bloquées dans les réglages de votre navigateur. Autorisez-les pour
          ce site, puis rechargez la page.
        </p>
      ) : session?.user ? (
        <Button size="lg" onClick={enable} disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bell className="mr-2 h-4 w-4" />
          )}
          Activer les notifications
        </Button>
      ) : (
        <Button size="lg" asChild className="w-full sm:w-auto">
          <Link to="/auth">
            <Bell className="mr-2 h-4 w-4" />
            Se connecter pour être notifié
          </Link>
        </Button>
      )}
    </aside>
  );
};
