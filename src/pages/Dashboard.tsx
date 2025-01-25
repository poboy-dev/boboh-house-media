import { useSession } from "@supabase/auth-helpers-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { UserManagement } from "./UserManagement";
import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const session = useSession();
  const location = useLocation();
  const isArticlesRoute = location.pathname === "/dashboard/articles";
  const isUsersRoute = location.pathname === "/dashboard/users";

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      console.log("Current session in Dashboard:", currentSession);
      
      if (error) {
        console.error("Session error in Dashboard:", error);
        toast.error("Erreur de session. Veuillez vous reconnecter.");
      }
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in Dashboard:", event, session);
      
      if (event === "SIGNED_OUT") {
        toast.info("Vous avez été déconnecté");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    console.log("No session found in Dashboard, redirecting to auth page");
    toast.error("Veuillez vous connecter pour accéder au tableau de bord");
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 p-6">
          <div className="container mx-auto">
            {isArticlesRoute ? (
              <ArticlesTable />
            ) : isUsersRoute ? (
              <UserManagement />
            ) : (
              <DashboardStats />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;