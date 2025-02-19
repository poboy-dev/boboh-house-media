
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home, LayoutDashboard, FileText, Users, Settings, Info, UsersRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export const DashboardSidebar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      console.log("Fetching user profile with ID:", session?.user?.id);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      console.log("Profile data retrieved:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Only show users management for admin users
  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    {
      title: "Accueil",
      icon: Home,
      path: "/",
    },
    {
      title: "Tableau de bord",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      title: "Articles",
      icon: FileText,
      path: "/dashboard/articles",
    },
    {
      title: "Services",
      icon: Settings,
      path: "/dashboard/services",
    },
    {
      title: "Équipe",
      icon: UsersRound,
      path: "/dashboard/team",
    },
    {
      title: "À propos",
      icon: Info,
      path: "/dashboard/about",
    },
    // Only show users management menu item for admins
    ...(isAdmin ? [{
      title: "Gestion des utilisateurs",
      icon: Users,
      path: "/dashboard/users",
    }] : []),
  ];

  return (
    <Sidebar className="bg-white shadow-lg">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="flex items-center gap-2"
                    isActive={location.pathname === item.path}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
