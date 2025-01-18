import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export const NavLinks = () => {
  const session = useSession();

  return (
    <>
      <Link to="/services" className="nav-link">Services</Link>
      <Link to="/portfolio" className="nav-link">Portfolio</Link>
      <Link to="/about" className="nav-link">À Propos</Link>
      <Link to="/contact" className="nav-link">Contact</Link>
      <Link to="/bobohgeek" className="nav-link">Boboh Geek</Link>
      <Link to="/bh-association" className="nav-link">BH Associations</Link>
      {session && (
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
      )}
    </>
  );
};