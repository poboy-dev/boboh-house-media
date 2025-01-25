import { useSession } from "@supabase/auth-helpers-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { UserManagement } from "./UserManagement";
import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const session = useSession();
  const location = useLocation();
  const isArticlesRoute = location.pathname === "/dashboard/articles";
  const isUsersRoute = location.pathname === "/dashboard/users";

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log("Current session:", currentSession);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change in Dashboard:", event, session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    console.log("No session found, redirecting to auth page");
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