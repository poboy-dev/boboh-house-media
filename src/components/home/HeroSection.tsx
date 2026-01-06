
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * Hero section with responsive background image.
 *
 * Uses `public/african-hero-bg.jpeg` as the background.
 */
export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-[80vh] md:min-h-screen flex items-center justify-center px-4 py-16 text-center text-white"
      style={{
        backgroundImage: "url('/african-hero-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay to keep text readable on all screens */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in leading-tight">
          Media Culturel
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8 animate-fade-in">
          La culture 237, c&apos;est nous
        </p>
        <Button
          asChild
          size="lg"
          className="bg-secondary hover:bg-secondary/90 px-6 sm:px-8 text-base sm:text-lg"
        >
          <Link to="/contact">Commencez votre projet</Link>
        </Button>
      </div>
    </section>
  );
};
