
import { Link } from "react-router-dom";
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

  return (
    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
      <Link to="/services" className="nav-link">Services</Link>
      <Link to="/portfolio" className="nav-link">Portfolio</Link>
      <Link to="/about" className="nav-link">À Propos</Link>
      <Link to="/contact" className="nav-link">Contact</Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="nav-link inline-flex items-center justify-between w-full md:w-auto">
          Pages <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          {categories?.map((category) => (
            <DropdownMenuItem key={category.slug}>
              <Link to={`/category/${category.slug}`} className="w-full inline-flex items-center">
                <FolderOpen className="mr-2 h-4 w-4" />
                {category.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {session && (
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      )}
    </div>
  );
};
