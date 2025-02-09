
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AboutContent, TimelineItem } from "@/types/about";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const About = () => {
  const session = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*");
      
      if (error) {
        console.error("Error fetching about content:", error);
        throw error;
      }
      
      return data as AboutContent[];
    }
  });

  const timelineContent = aboutContent?.find(content => content.section === "timeline")?.content as TimelineItem[] || [];
  const missionContent = aboutContent?.find(content => content.section === "mission")?.content.text || "";
  const valuesContent = aboutContent?.find(content => content.section === "values")?.content.text || "";
  const visionContent = aboutContent?.find(content => content.section === "vision")?.content.text || "";

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
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

      <section className="bg-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Notre Histoire</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Boboh House Media est né d'une passion pour la culture camerounaise et d'une vision audacieuse : "Promouvoir la culture et la consommation locale".
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-bullseye"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
            <p className="text-gray-600">
              {missionContent}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-heart"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Nos Valeurs</h3>
            <p className="text-gray-600">
              {valuesContent}
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Notre Vision</h3>
            <p className="text-gray-600">
              {visionContent}
            </p>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Parcours</h2>
          <div className="max-w-3xl mx-auto">
            {timelineContent.map((item, index) => (
              <div key={index} className="flex mb-8">
                <div className="w-24 flex-shrink-0">
                  <div className="text-[#E74C3C] font-bold">{item.year}</div>
                </div>
                <div className="border-l-2 border-[#E74C3C] pl-8">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
