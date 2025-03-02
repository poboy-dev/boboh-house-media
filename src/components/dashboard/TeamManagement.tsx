
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TeamMemberForm } from "./team/TeamMemberForm";
import { TeamMemberCard } from "./team/TeamMemberCard";

export const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
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

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Erreur lors du téléchargement de l'image");
      throw error;
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
    },
    onError: (error) => {
      console.error("Error creating team member:", error);
      toast.error("Erreur lors de la création du membre");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (member: Partial<TeamMember> & { id: string }) => {
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

  const handleCreate = async (newMember: Partial<TeamMember>) => {
    try {
      await createMutation.mutateAsync(newMember);
    } catch (error) {
      console.error("Error creating team member:", error);
    }
  };

  const handleUpdate = async (member: Partial<TeamMember>) => {
    if (!editingId) return;
    try {
      await updateMutation.mutateAsync({ ...member, id: editingId });
    } catch (error) {
      console.error("Error updating team member:", error);
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
          onClick={() => setIsCreating(true)} 
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isCreating && (
          <Card className="p-4">
            <TeamMemberForm
              onSave={handleCreate}
              onCancel={() => setIsCreating(false)}
              uploading={uploading}
              onImageUpload={async (file, memberId) => {
                const publicUrl = await handleImageUpload(file, memberId);
                return publicUrl;
              }}
            />
          </Card>
        )}

        {teamMembers?.map((member) => (
          editingId === member.id ? (
            <Card key={member.id} className="p-4">
              <TeamMemberForm
                member={member}
                onSave={handleUpdate}
                onCancel={() => setEditingId(null)}
                uploading={uploading}
                onImageUpload={async (file, memberId) => {
                  const publicUrl = await handleImageUpload(file, memberId);
                  return publicUrl;
                }}
              />
            </Card>
          ) : (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={(member) => setEditingId(member.id)}
              onDelete={handleDelete}
            />
          )
        ))}
      </div>
    </div>
  );
};
