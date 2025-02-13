
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AboutContent, TimelineItem } from "@/types/about";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const About = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{[key: string]: any}>({});
  const [newTimelineItem, setNewTimelineItem] = useState<Partial<TimelineItem>>({});

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

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: any }) => {
      const { error } = await supabase
        .from("about_content")
        .update({ content })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aboutContent"] });
      toast.success("Contenu mis à jour avec succès");
      setEditingSection(null);
      setEditForm({});
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast.error("Erreur lors de la mise à jour du contenu");
    }
  });

  const timelineContent = aboutContent?.find(content => content.section === "timeline")?.content as TimelineItem[] || [];
  const missionContent = aboutContent?.find(content => content.section === "mission")?.content.text || "";
  const valuesContent = aboutContent?.find(content => content.section === "values")?.content.text || "";
  const visionContent = aboutContent?.find(content => content.section === "vision")?.content.text || "";

  const handleEdit = (section: string, content: any) => {
    setEditingSection(section);
    setEditForm(content);
  };

  const handleSave = async (section: string) => {
    const sectionData = aboutContent?.find(content => content.section === section);
    if (!sectionData) return;

    let updatedContent;
    if (section === "timeline") {
      updatedContent = editForm;
    } else {
      updatedContent = { text: editForm.text };
    }

    try {
      await updateMutation.mutateAsync({
        id: sectionData.id,
        content: updatedContent
      });
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const handleAddTimelineItem = async () => {
    const timelineSection = aboutContent?.find(content => content.section === "timeline");
    if (!timelineSection) return;

    const updatedTimeline = [...timelineContent, newTimelineItem];
    try {
      await updateMutation.mutateAsync({
        id: timelineSection.id,
        content: updatedTimeline
      });
      setNewTimelineItem({});
    } catch (error) {
      console.error("Error adding timeline item:", error);
    }
  };

  const handleDeleteTimelineItem = async (index: number) => {
    const timelineSection = aboutContent?.find(content => content.section === "timeline");
    if (!timelineSection) return;

    const updatedTimeline = timelineContent.filter((_, i) => i !== index);
    try {
      await updateMutation.mutateAsync({
        id: timelineSection.id,
        content: updatedTimeline
      });
    } catch (error) {
      console.error("Error deleting timeline item:", error);
    }
  };

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
            {isEditing ? "Mode lecture" : "Mode édition"}
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
            {isEditing && editingSection === "mission" ? (
              <div className="space-y-4">
                <Textarea
                  value={editForm.text || ""}
                  onChange={(e) => setEditForm({ text: e.target.value })}
                  className="w-full"
                />
                <Button 
                  onClick={() => handleSave("mission")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <div className="relative">
                <p className="text-gray-600">{missionContent}</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleEdit("mission", { text: missionContent })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-heart"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Nos Valeurs</h3>
            {isEditing && editingSection === "values" ? (
              <div className="space-y-4">
                <Textarea
                  value={editForm.text || ""}
                  onChange={(e) => setEditForm({ text: e.target.value })}
                  className="w-full"
                />
                <Button 
                  onClick={() => handleSave("values")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <div className="relative">
                <p className="text-gray-600">{valuesContent}</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleEdit("values", { text: valuesContent })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Notre Vision</h3>
            {isEditing && editingSection === "vision" ? (
              <div className="space-y-4">
                <Textarea
                  value={editForm.text || ""}
                  onChange={(e) => setEditForm({ text: e.target.value })}
                  className="w-full"
                />
                <Button 
                  onClick={() => handleSave("vision")}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <div className="relative">
                <p className="text-gray-600">{visionContent}</p>
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => handleEdit("vision", { text: visionContent })}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Parcours</h2>
          {isEditing && (
            <div className="max-w-3xl mx-auto mb-8 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">Ajouter une étape</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    value={newTimelineItem.year || ""}
                    onChange={(e) => setNewTimelineItem({ ...newTimelineItem, year: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={newTimelineItem.title || ""}
                    onChange={(e) => setNewTimelineItem({ ...newTimelineItem, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTimelineItem.description || ""}
                    onChange={(e) => setNewTimelineItem({ ...newTimelineItem, description: e.target.value })}
                  />
                </div>
                <Button 
                  onClick={handleAddTimelineItem}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
          )}
          <div className="max-w-3xl mx-auto">
            {timelineContent.map((item, index) => (
              <div key={index} className="flex mb-8 relative">
                <div className="w-24 flex-shrink-0">
                  <div className="text-[#E74C3C] font-bold">{item.year}</div>
                </div>
                <div className="border-l-2 border-[#E74C3C] pl-8">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  {isEditing && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => handleDeleteTimelineItem(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
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
