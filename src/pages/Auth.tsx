import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { AuthError } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
      if (event === "USER_UPDATED") {
        const checkSession = async () => {
          const { error } = await supabase.auth.getSession();
          if (error) {
            setErrorMessage(getErrorMessage(error));
          }
        };
        checkSession();
      }
      if (event === "SIGNED_OUT") {
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
    default:
      return error.message;
  }
};

export default Auth;