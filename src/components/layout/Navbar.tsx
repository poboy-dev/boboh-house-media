import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
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

  return (
    <nav className="fixed w-full gradient-header z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/BObohhouse media.webp" 
                alt="BobohHouse Media Logo" 
                className="h-12 w-12 rounded-full mr-3"
              />
              <span className="text-white text-xl font-bold">Boboh House Media</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/services" className="nav-link">Services</Link>
              <Link to="/portfolio" className="nav-link">Portfolio</Link>
              <Link to="/about" className="nav-link">À Propos</Link>
              <Link to="/contact" className="nav-link">Contact</Link>
              <Link to="/bobohgeek" className="nav-link">Boboh Geek</Link>
              <Link to="/bh-association" className="nav-link">BH Associations</Link>
              {session && (
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
              )}
              {session ? (
                <Button 
                  variant="secondary"
                  onClick={handleLogout}
                  className="text-white hover:text-primary-foreground"
                >
                  Déconnexion
                </Button>
              ) : (
                <Button 
                  variant="secondary"
                  onClick={() => navigate("/auth")}
                  className="text-white hover:text-primary-foreground"
                >
                  Connexion
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gray-300 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/services" className="nav-link block px-3 py-2">Services</Link>
            <Link to="/portfolio" className="nav-link block px-3 py-2">Portfolio</Link>
            <Link to="/about" className="nav-link block px-3 py-2">À Propos</Link>
            <Link to="/contact" className="nav-link block px-3 py-2">Contact</Link>
            <Link to="/bobohgeek" className="nav-link block px-3 py-2">Boboh Geek</Link>
            <Link to="/bh-association" className="nav-link block px-3 py-2">BH Associations</Link>
            {session && (
              <Link to="/dashboard" className="nav-link block px-3 py-2">Dashboard</Link>
            )}
            {session ? (
              <Button 
                variant="secondary"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2"
              >
                Déconnexion
              </Button>
            ) : (
              <Button 
                variant="secondary"
                onClick={() => navigate("/auth")}
                className="w-full text-left px-3 py-2"
              >
                Connexion
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};