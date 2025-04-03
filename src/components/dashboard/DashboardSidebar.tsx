
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home, LayoutDashboard, FileText, Users, Settings, Info, UsersRound, FolderTree, Menu } from "lucide-react";
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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

export const DashboardSidebar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toggleSidebar } = useSidebar();

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
      title: "Catégories",
      icon: FolderTree,
      path: "/dashboard/categories",
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
    ...(isAdmin ? [{
      title: "Gestion des utilisateurs",
      icon: Users,
      path: "/dashboard/users",
    }] : []),
  ];

  // Mobile menu toggle button
  const MobileMenuToggle = () => (
    <div className="fixed top-4 right-4 z-50 md:hidden">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="h-10 w-10 rounded-full shadow-md bg-background"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </Button>
    </div>
  );

  return (
    <>
      <MobileMenuToggle />
      <Sidebar className="sidebar-background shadow-lg">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-black opacity-90">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) toggleSidebar();
                      }}
                      className="flex items-center gap-2 text-black hover:bg-white/10"
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
    </>
  );
};
