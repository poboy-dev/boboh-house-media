import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Home, LayoutDashboard, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const DashboardSidebar = () => {
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

  const menuItems = [
    {
      title: "Accueil",
      icon: Home,
      onClick: () => navigate("/"),
    },
    {
      title: "Tableau de bord",
      icon: LayoutDashboard,
      onClick: () => navigate("/dashboard"),
    },
    {
      title: "Articles",
      icon: FileText,
      onClick: () => navigate("/dashboard/articles"),
    },
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
                    onClick={item.onClick}
                    className="flex items-center gap-2"
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