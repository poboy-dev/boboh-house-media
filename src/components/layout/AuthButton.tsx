import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const AuthButton = () => {
  const session = useSession();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return session ? (
    <Button 
      variant="secondary"
      onClick={handleLogout}
      className="text-white hover:text-primary-foreground"
    >
      Déconnexion
    </Button>
  ) : (
    <Button 
      variant="secondary"
      onClick={() => navigate("/auth")}
      className="text-white hover:text-primary-foreground"
    >
      Connexion
    </Button>
  );
};