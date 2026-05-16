
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const Services = () => {
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*");

      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }

      return data as Service[];
    }
  });



  // ...

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Nos Services
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Découvrez notre gamme complète de services de production audiovisuelle professionnelle
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          {session?.user && (
            <div className="mb-8">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pencil className="h-4 w-4" />
                {isEditing ? "View Mode" : "Edit Mode"}
              </Button>
            </div>
          )}

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {services?.map((service) => (
              <motion.div key={service.id} variants={cardVariants}>
                <div className="group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50 dark:border dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 h-full flex flex-col">
                  {/* Image */}
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-2 font-heading group-hover:text-primary transition-colors text-neutral-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground dark:text-zinc-300 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-muted-foreground dark:text-zinc-400 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      to="/contact"
                      className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 font-medium group/btn"
                    >
                      Demander un devis
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
