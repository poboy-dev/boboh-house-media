
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, Trash, Plus, Upload } from "lucide-react";
import { toast } from "sonner";

export const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [uploading, setUploading] = useState(false);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order('order_index');
      
      if (error) {
        console.error("Error fetching team members:", error);
        throw error;
      }
      
      return data as TeamMember[];
    }
  });

  const handleImageUpload = async (file: File, memberId: string) => {
    try {
      setUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('team_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('team_images')
        .getPublicUrl(filePath);

      // Update the form with the new image URL
      setEditForm({ ...editForm, image: publicUrl });
      
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (member: TeamMember) => {
      const { error } = await supabase
        .from("team_members")
        .update({
          name: member.name,
          role: member.role,
          image: member.image,
          order_index: member.order_index
        })
        .eq("id", member.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Membre mis à jour avec succès");
      setEditingId(null);
      setEditForm({});
    },
    onError: (error) => {
      console.error("Error updating team member:", error);
      toast.error("Erreur lors de la mise à jour du membre");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get the member's current image URL
      const member = teamMembers?.find(m => m.id === id);
      if (member?.image) {
        // Extract the file name from the URL
        const fileName = member.image.split('/').pop();
        if (fileName) {
          // Delete the image from storage
          await supabase.storage
            .from('team_images')
            .remove([fileName]);
        }
      }

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Membre supprimé avec succès");
    },
    onError: (error) => {
      console.error("Error deleting team member:", error);
      toast.error("Erreur lors de la suppression du membre");
    }
  });

  const handleEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditForm(member);
  };

  const handleSave = async (member: TeamMember) => {
    try {
      await updateMutation.mutateAsync({
        ...member,
        ...editForm
      } as TeamMember);
    } catch (error) {
      console.error("Error saving team member:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting team member:", error);
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
        <h2 className="text-2xl font-bold">Gestion de l'Équipe</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers?.map((member) => (
          <Card key={member.id} className="p-4">
            {editingId === member.id ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={editForm.name || member.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select
                    value={editForm.role || member.role}
                    onValueChange={(value) => setEditForm({ ...editForm, role: value as TeamMember['role'] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CEO">CEO</SelectItem>
                      <SelectItem value="DG">DG</SelectItem>
                      <SelectItem value="SG">SG</SelectItem>
                      <SelectItem value="REDACTRICE">REDACTRICE</SelectItem>
                      <SelectItem value="COMMUNICATRICE">COMMUNICATRICE</SelectItem>
                      <SelectItem value="COMMUNICATEUR">COMMUNICATEUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="image">Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, member.id);
                        }
                      }}
                      className="flex-1"
                    />
                    {uploading && (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    )}
                  </div>
                  {editForm.image && (
                    <div className="mt-2">
                      <img
                        src={editForm.image}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="order">Ordre d'affichage</Label>
                  <Input
                    id="order"
                    type="number"
                    value={editForm.order_index || member.order_index}
                    onChange={(e) => setEditForm({ ...editForm, order_index: parseInt(e.target.value) })}
                  />
                </div>

                <Button 
                  onClick={() => handleSave(member)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(member)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="aspect-square mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Ordre d'affichage: {member.order_index}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
