
import { useSession } from "@supabase/auth-helpers-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { ServicesManagement } from "@/components/dashboard/ServicesManagement";
import { TeamManagement } from "@/components/dashboard/TeamManagement";
import { UserManagement } from "./UserManagement";
import About from "./About";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CategoryManagement } from "@/components/dashboard/categories/CategoryManagement";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const session = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);
  const isMobile = useIsMobile();

  const isArticlesRoute = location.pathname === "/dashboard/articles";
  const isUsersRoute = location.pathname === "/dashboard/users";
  const isServicesRoute = location.pathname === "/dashboard/services";
  const isTeamRoute = location.pathname === "/dashboard/team";
  const isAboutRoute = location.pathname === "/dashboard/about";
  const isCategoriesRoute = location.pathname === "/dashboard/categories";

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        console.log("Current session in Dashboard:", currentSession);

        if (error) {
          console.error("Session error in Dashboard:", error);
          toast.error("Erreur de session. Veuillez vous reconnecter.");
          setHasValidSession(false);
        } else if (currentSession) {
          setHasValidSession(true);
        } else {
          console.log("No session found in Dashboard, redirecting to auth");
          setHasValidSession(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setHasValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in Dashboard:", event, session);

      if (event === "SIGNED_OUT") {
        setHasValidSession(false);
        toast.info("Vous avez été déconnecté");
      } else if (event === "SIGNED_IN" && session) {
        setHasValidSession(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!hasValidSession) {
    console.log("No valid session found in Dashboard, redirecting to auth page");
    toast.error("Veuillez vous connecter pour accéder au tableau de bord");
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col md:flex-row w-full">
        <DashboardSidebar />
        <main className="flex-1 p-3 md:p-6 overflow-x-auto bg-background/50">
          <div className="container mx-auto px-0 md:px-4 space-y-6">
            {/* Header with Welcome & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold font-heading">
                  Bienvenue, <span className="text-primary">{session?.user?.email?.split('@')[0]}</span>
                </h1>
                <p className="text-muted-foreground mt-1">
                  Voici ce qui se passe sur Boboh House Media aujourd'hui.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate("/dashboard/articles")}
                  className="bg-primary hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 h-11"
                >
                  <Plus className="w-4 h-4" />
                  Nouvel Article
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/dashboard/team")}
                  className="rounded-xl px-4 py-2 text-sm font-semibold flex items-center gap-2 h-11 border-primary/20 hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4" />
                  Équipe
                </Button>
              </div>
            </div>

            <div className="w-full">
              {isCategoriesRoute ? (
                <CategoryManagement />
              ) : isArticlesRoute ? (
                <ArticlesTable />
              ) : isUsersRoute ? (
                <UserManagement />
              ) : isServicesRoute ? (
                <ServicesManagement />
              ) : isTeamRoute ? (
                <TeamManagement />
              ) : isAboutRoute ? (
                <About />
              ) : (
                <DashboardStats />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
