import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/ui/image-picker";
import { Pencil, Save, Trash, Plus } from "lucide-react";
import { toast } from "sonner";

export const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TeamMember>>({});
  const [uploading, setUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('team_images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('team_images')
        .getPublicUrl(filePath);

      setEditForm({ ...editForm, image: publicUrl });
      
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
    } finally {
      setUploading(false);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (newMember: Partial<TeamMember>) => {
      const maxOrder = teamMembers?.reduce((max, member) => 
        Math.max(max, member.order_index || 0), 0) || 0;

      const { error } = await supabase
        .from("team_members")
        .insert({
          name: newMember.name || '',
          role: newMember.role || 'REDACTRICE',
          image: newMember.image,
          order_index: maxOrder + 1
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Membre ajouté avec succès");
      setIsCreating(false);
      setEditForm({});
    },
    onError: (error) => {
      console.error("Error creating team member:", error);
      toast.error("Erreur lors de la création du membre");
    }
  });

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
      const member = teamMembers?.find(m => m.id === id);
      if (member?.image) {
        const fileName = member.image.split('/').pop();
        if (fileName) {
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

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(editForm);
    } catch (error) {
      console.error("Error creating team member:", error);
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
        <Button 
          onClick={() => {
            setIsCreating(true);
            setEditForm({});
          }} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isCreating && (
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nom du membre"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={editForm.role || 'REDACTRICE'}
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
                <ImagePicker
                  value={editForm.image || undefined}
                  onChange={(file) => {
                    const tempId = crypto.randomUUID();
                    handleImageUpload(file, tempId);
                  }}
                  loading={uploading}
                  onRemove={editForm.image ? () => setEditForm({ ...editForm, image: null }) : undefined}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreate}
                  className="flex-1"
                >
                  Créer
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditForm({});
                  }}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        )}

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
                  <ImagePicker
                    value={editForm.image || undefined}
                    onChange={(file) => handleImageUpload(file, member.id)}
                    loading={uploading}
                    onRemove={editForm.image ? () => setEditForm({ ...editForm, image: null }) : undefined}
                  />
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

                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSave(member)}
                    className="flex-1"
                  >
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
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
                
                <div className="aspect-square mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
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
