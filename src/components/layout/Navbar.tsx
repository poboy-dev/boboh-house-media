import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { AuthButton } from "./AuthButton";
import { useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  // Check if we're on the dashboard route
  const isDashboard = location.pathname === "/dashboard";

  return (
    <nav className="fixed w-full gradient-header z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {!isDashboard && <NavLinks />}
              <AuthButton />
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
            {!isDashboard && <NavLinks />}
            <AuthButton />
          </div>
        </div>
      )}
    </nav>
  );
};