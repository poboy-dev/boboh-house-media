import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedSession, setHasCheckedSession] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          console.log("User already logged in, redirecting to dashboard");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setHasCheckedSession(true);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log("Auth state change:", event);

      if (event === "SIGNED_IN" && session) {
        console.log("Sign in successful");
        toast.success("Connexion réussie!");
        navigate("/dashboard");
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading || !hasCheckedSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-foreground mb-8">
          Bienvenue sur BobohHouse Media
        </h2>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { 
                background: 'hsl(var(--primary))', 
                color: 'white',
                borderRadius: '0.375rem',
                padding: '0.75rem 1rem',
              },
              anchor: { 
                color: 'hsl(var(--primary))',
                textDecoration: 'underline', 
              },
              message: { 
                color: 'hsl(var(--destructive))',
                marginBottom: '1rem',
              },
              container: { 
                color: 'hsl(var(--foreground))',
              },
              input: {
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.375rem',
                padding: '0.75rem 1rem',
              },
              label: {
                color: 'hsl(var(--foreground))',
                marginBottom: '0.5rem',
              }
            },
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                  inputBackground: 'hsl(var(--background))',
                  inputText: 'hsl(var(--foreground))',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Mot de passe',
                email_input_placeholder: 'Votre email',
                password_input_placeholder: 'Votre mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours ...',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Mot de passe',
                email_input_placeholder: 'Votre email',
                password_input_placeholder: 'Votre mot de passe',
                button_label: "S'inscrire",
                loading_button_label: 'Inscription en cours ...',
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Auth;