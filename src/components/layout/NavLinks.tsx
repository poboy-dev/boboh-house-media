import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavLinks = () => {
  const session = useSession();

  return (
    <>
      <Link to="/services" className="nav-link">Services</Link>
      <Link to="/portfolio" className="nav-link">Portfolio</Link>
      <Link to="/about" className="nav-link">À Propos</Link>
      <Link to="/contact" className="nav-link">Contact</Link>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="nav-link inline-flex items-center">
          Pages <ChevronDown className="ml-1 h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Link to="/bobohgeek" className="w-full">Boboh Geek</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to="/bh-association" className="w-full">BH Associations</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {session && (
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      )}
    </>
  );
};