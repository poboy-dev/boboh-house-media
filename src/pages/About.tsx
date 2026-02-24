
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { AboutContent, TimelineItem } from "@/types/about";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, Plus, Trash, Target, Heart, Lightbulb } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const About = () => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ [key: string]: any }>({});
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
        <LoadingSpinner size={48} />
      </div>
    );
  }

  const valueCards = [
    {
      icon: Target,
      title: "Notre Mission",
      section: "mission",
      content: missionContent,
      gradient: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary",
    },
    {
      icon: Heart,
      title: "Nos Valeurs",
      section: "values",
      content: valuesContent,
      gradient: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      icon: Lightbulb,
      title: "Notre Vision",
      section: "vision",
      content: visionContent,
      gradient: "from-secondary/20 to-primary/5",
      iconColor: "text-secondary",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Banner */}
      <section className="relative py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {session?.user && (
            <div className="mb-8">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Pencil className="h-4 w-4 mr-2" />
                {isEditing ? "Mode lecture" : "Mode édition"}
              </Button>
            </div>
          )}
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 font-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Notre Histoire
          </motion.h1>
          <motion.p
            className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Boboh House Media est né d'une passion pour la culture camerounaise et d'une vision audacieuse : "Promouvoir la culture et la consommation locale".
          </motion.p>
        </div>
      </section>

      {/* Mission / Values / Vision */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {valueCards.map((card, index) => (
            <motion.div
              key={card.section}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="glass-card p-8 h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6`}>
                  <card.icon className={`w-7 h-7 ${card.iconColor}`} />
                </div>

                <h3 className="text-xl font-semibold mb-3 font-heading">{card.title}</h3>

                {isEditing && editingSection === card.section ? (
                  <div className="space-y-4">
                    <Textarea
                      value={editForm.text || ""}
                      onChange={(e) => setEditForm({ text: e.target.value })}
                      className="w-full"
                    />
                    <Button
                      onClick={() => handleSave(card.section)}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <p className="text-muted-foreground leading-relaxed">{card.content}</p>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-0 right-0"
                        onClick={() => handleEdit(card.section, { text: card.content })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading">Notre Parcours</h2>
            <div className="section-divider" />
          </motion.div>

          {isEditing && (
            <div className="max-w-3xl mx-auto mb-12 p-6 rounded-2xl bg-white dark:bg-zinc-900 dark:border dark:border-white/10 shadow-md">
              <h3 className="font-semibold mb-4 font-heading">Ajouter une étape</h3>
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
              <motion.div
                key={index}
                className="flex mb-10 relative group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Year */}
                <div className="w-24 flex-shrink-0 pt-1">
                  <span className="inline-block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-lg">
                    {item.year}
                  </span>
                </div>

                {/* Line and dot */}
                <div className="relative mr-8 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-secondary/20 flex-shrink-0 mt-2" />
                  <div className="w-0.5 flex-1 bg-gradient-to-b from-secondary/40 to-transparent mt-2" />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <h3 className="font-semibold text-xl mb-2 font-heading group-hover:text-primary transition-colors text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-zinc-300 leading-relaxed">{item.description}</p>
                  {isEditing && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTimelineItem(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
