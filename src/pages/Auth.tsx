import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import type { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

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
        setErrorMessage(getErrorMessage(error));
        toast.error(getErrorMessage(error));
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
        setErrorMessage("Session expirée. Veuillez vous reconnecter.");
        toast.error("Session expirée. Veuillez vous reconnecter.");
      }

      if (event === "USER_UPDATED") {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Session error:", error);
          setErrorMessage(getErrorMessage(error));
          toast.error(getErrorMessage(error));
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out - clearing error message");
        setErrorMessage("");
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
        {errorMessage && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
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

const getErrorMessage = (error: AuthError) => {
  switch (error.message) {
    case "Invalid login credentials":
      return "Email ou mot de passe incorrect.";
    case "Email not confirmed":
      return "Veuillez vérifier votre email pour confirmer votre compte.";
    case "Invalid Refresh Token: Refresh Token Not Found":
      return "Votre session a expiré. Veuillez vous reconnecter.";
    default:
      return error.message;
  }
};

export default Auth;