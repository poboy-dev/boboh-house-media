
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center px-4 py-20 text-center text-white overflow-hidden"
      style={{
        backgroundImage: "url('/african-hero-bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white/90 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Media Culturel Camerounais
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight font-heading"
        >
          La culture <span className="text-primary">237</span>,{" "}
          <br className="hidden sm:block" />
          c&apos;est{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            nous
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Promouvoir la culture et la consommation locale à travers
          la production audiovisuelle professionnelle.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 px-8 text-base sm:text-lg rounded-full shadow-lg hover:shadow-secondary/25 hover:shadow-xl transition-all duration-300 group"
          >
            <Link to="/contact" className="flex items-center gap-2">
              Commencez votre projet
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            asChild
            variant="default"
            size="lg"
            className="bg-zinc-100 text-zinc-900 hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-white border-none px-8 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <Link to="/portfolio" className="flex items-center gap-2">
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Voir nos réalisations
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
          <motion.div
            className="w-1.5 h-3 bg-white/60 rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
};
