import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed w-full bg-background/80 backdrop-blur-sm z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              MonSite
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                Accueil
              </Link>
              <Link to="/posts" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                Posts
              </Link>
              <Link to="/contact" className="text-foreground/80 hover:text-foreground px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
              <Button variant="default" size="sm">
                Commencer
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 animate-fade-in">
            <Link
              to="/"
              className="text-foreground/80 hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Accueil
            </Link>
            <Link
              to="/posts"
              className="text-foreground/80 hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Posts
            </Link>
            <Link
              to="/contact"
              className="text-foreground/80 hover:text-foreground block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <div className="px-3 py-2">
              <Button className="w-full" variant="default">
                Commencer
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};