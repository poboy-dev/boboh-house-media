
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { ChevronDown, FolderOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  slug: string;
  name: string;
}

export const NavLinks = () => {
  const session = useSession();
  const location = useLocation();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_categories")
        .select("slug, name")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-1 space-y-1 md:space-y-0">
      <Link to="/services" className={`nav-link ${isActive("/services") ? "active" : ""}`}>
        Services
      </Link>
      <Link to="/portfolio" className={`nav-link ${isActive("/portfolio") ? "active" : ""}`}>
        Portfolio
      </Link>
      <Link to="/about" className={`nav-link ${isActive("/about") ? "active" : ""}`}>
        À Propos
      </Link>
      <Link to="/contact" className={`nav-link ${isActive("/contact") ? "active" : ""}`}>
        Contact
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="nav-link inline-flex items-center justify-start w-full md:w-auto">
          Pages <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-56 p-2 bg-popover/95 backdrop-blur-xl border border-border/60 shadow-2xl rounded-xl animate-in fade-in-0 zoom-in-95"
        >
          {categories?.map((category) => (
            <DropdownMenuItem
              key={category.slug}
              asChild
              className="group rounded-lg px-2 py-2 cursor-pointer transition-all duration-200 focus:bg-gradient-to-r focus:from-primary/15 focus:to-secondary/15 focus:text-foreground"
            >
              <Link
                to={`/category/${category.slug}`}
                className="w-full inline-flex items-center gap-2 text-foreground/80 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200"
              >
                <FolderOpen className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{category.name}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {session && (
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
          Dashboard
        </Link>
      )}
    </div>
  );
};
