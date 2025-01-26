import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isSubscribed = true;
    let redirectTimeout: NodeJS.Timeout;
    let toastTimeout: NodeJS.Timeout;

    // Check if user is already logged in
    const checkCurrentSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("Current session on Auth page:", session);
        
        if (session && isSubscribed) {
          console.log("User already logged in, redirecting to dashboard");
          // Debounce redirect and toast
          clearTimeout(redirectTimeout);
          clearTimeout(toastTimeout);
          
          toastTimeout = setTimeout(() => {
            toast.success("Vous êtes déjà connecté");
          }, 100);
          
          redirectTimeout = setTimeout(() => {
            navigate("/dashboard");
          }, 200);
        }
        
        if (error) {
          console.error("Session check error:", error);
          toast.error("Erreur de session: " + error.message);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };
    
    checkCurrentSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);
      
      if (!isSubscribed) return;

      if (event === "SIGNED_IN" && session) {
        console.log("Sign in successful, redirecting to dashboard");
        // Debounce redirect and toast
        clearTimeout(redirectTimeout);
        clearTimeout(toastTimeout);
        
        toastTimeout = setTimeout(() => {
          toast.success("Connexion réussie");
        }, 100);
        
        redirectTimeout = setTimeout(() => {
          navigate("/dashboard");
        }, 200);
      }
      
      if (event === "TOKEN_REFRESHED" && !session) {
        console.log("Token refresh failed - clearing session");
        await supabase.auth.signOut();
        toast.error("Session expirée. Veuillez vous reconnecter.");
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out");
        toast.info("Déconnexion réussie");
      }
    });

    return () => {
      isSubscribed = false;
      clearTimeout(redirectTimeout);
      clearTimeout(toastTimeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center">Welcome to BobohHouse Media</h2>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: 'rgb(var(--primary))', color: 'white' },
              anchor: { color: 'rgb(var(--primary))' },
            }
          }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Auth;