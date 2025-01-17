import { useNavigate } from "react-router-dom";
import { Home, FilePlus, Tag, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

export function DashboardSidebar() {
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

  const items = [
    {
      title: "Accueil",
      icon: Home,
      onClick: () => navigate("/"),
    },
    {
      title: "Créer un article",
      icon: FilePlus,
      onClick: () => navigate("/new-article"),
    },
    {
      title: "Créer une catégorie",
      icon: Tag,
      onClick: () => navigate("/categories/new"),
    },
    {
      title: "Déconnexion",
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={item.onClick}
                    className="w-full flex items-center gap-2"
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
}