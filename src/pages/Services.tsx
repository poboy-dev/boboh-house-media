
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

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

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">Nos Services</h1>
        <p className="text-lg text-muted-foreground">
          Découvrez notre gamme complète de services de production audiovisuelle professionnelle
        </p>
      </div>

      {session?.user && (
        <div className="container mx-auto px-4 mb-8">
          <Button 
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            {isEditing ? "View Mode" : "Edit Mode"}
          </Button>
        </div>
      )}

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services?.map((service, index) => (
          <Card 
            key={service.id} 
            className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-muted-foreground">
                    <span className="text-primary mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors">
                Demander un devis
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;
