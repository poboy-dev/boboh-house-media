import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const AuthButton = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      console.log("Fetching user profile...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      console.log("Profile fetched:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

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
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-full hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
            <AvatarFallback>
              <UserRound className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                <UserRound className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm font-semibold">
                {session?.user?.email}
              </h4>
              <p className="text-sm text-muted-foreground">
                Role: {profile?.role || "User"}
              </p>
            </div>
          </div>
          <Button 
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            Déconnexion
          </Button>
        </div>
      </PopoverContent>
    </Popover>
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