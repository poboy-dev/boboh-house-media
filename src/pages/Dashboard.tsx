import { useSession } from "@supabase/auth-helpers-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { UserManagement } from "./UserManagement";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const session = useSession();
  const location = useLocation();
  const isArticlesRoute = location.pathname === "/dashboard/articles";
  const isUsersRoute = location.pathname === "/dashboard/users";

  if (!session) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Veuillez vous connecter pour accéder au tableau de bord.</p>
      </div>
    );
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