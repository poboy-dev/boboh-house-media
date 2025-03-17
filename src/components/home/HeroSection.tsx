
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection: React.FC = () => {
  return (
    <section className="hero-section min-h-screen flex items-center justify-center text-center text-white px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Media Culturel
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-fade-in">
          La culture 237, c'est nous
        </p>
        <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
          <Link to="/contact">Commencez votre projet</Link>
        </Button>
      </div>
    </section>
  );
};
