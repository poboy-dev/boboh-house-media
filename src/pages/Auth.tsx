import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkCurrentSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Current session on Auth page:", session);
      
      if (session) {
        console.log("User already logged in, redirecting to dashboard");
        toast.success("Vous êtes déjà connecté");
        navigate("/dashboard");
      }
      
      if (error) {
        console.error("Session check error:", error);
        toast.error("Erreur de session: " + error.message);
      }
    };
    
    checkCurrentSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event, session);
      
      if (event === "SIGNED_IN" && session) {
        console.log("Sign in successful, redirecting to dashboard");
        toast.success("Connexion réussie");
        navigate("/dashboard");
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
      subscription.unsubscribe();
    };
  }, [navigate]);

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