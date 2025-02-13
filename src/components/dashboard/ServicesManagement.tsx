
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Save, Trash, Plus } from "lucide-react";
import { toast } from "sonner";

export const ServicesManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Service>>({});

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

  const updateMutation = useMutation({
    mutationFn: async (service: Service) => {
      const { error } = await supabase
        .from("services")
        .update({
          title: service.title,
          description: service.description,
          features: service.features,
          image: service.image
        })
        .eq("id", service.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service mis à jour avec succès");
      setEditingId(null);
      setEditForm({});
    },
    onError: (error) => {
      console.error("Error updating service:", error);
      toast.error("Erreur lors de la mise à jour du service");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast.success("Service supprimé avec succès");
    },
    onError: (error) => {
      console.error("Error deleting service:", error);
      toast.error("Erreur lors de la suppression du service");
    }
  });

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm(service);
  };

  const handleSave = async (service: Service) => {
    try {
      await updateMutation.mutateAsync({
        ...service,
        ...editForm
      });
    } catch (error) {
      console.error("Error saving service:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Services</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="p-4">
            {editingId === service.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={editForm.title || service.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editForm.description || service.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={editForm.image || service.image || ''}
                    onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
                  <Input
                    id="features"
                    value={editForm.features?.join(', ') || service.features.join(', ')}
                    onChange={(e) => setEditForm({ 
                      ...editForm, 
                      features: e.target.value.split(',').map(f => f.trim()) 
                    })}
                  />
                </div>

                <Button 
                  onClick={() => handleSave(service)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-32 object-cover rounded mb-4"
                />
                
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                
                <div className="space-y-1">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="text-sm flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
