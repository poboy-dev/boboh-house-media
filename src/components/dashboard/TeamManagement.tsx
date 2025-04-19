
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TeamMemberForm } from "./team/TeamMemberForm";
import { TeamMemberCard } from "./team/TeamMemberCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const TeamManagement = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

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
      
      // Preserve the original filename but prepend with memberId for uniqueness
      const originalFileName = file.name;
      const fileName = `${memberId}-${originalFileName}`;
      
      // Clean up the filename to ensure it's valid
      const cleanFileName = fileName.replace(/\s+/g, '_');
      
      console.log("Uploading file:", cleanFileName);
      
      const { error: uploadError } = await supabase.storage
        .from('team_images')
        .upload(cleanFileName, file, {
          cacheControl: '3600',
          upsert: true // Replace if file already exists
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('team_images')
        .getPublicUrl(cleanFileName);

      console.log("File uploaded successfully, public URL:", publicUrl);
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
      console.log("Creating team member:", newMember);
      
      const maxOrder = teamMembers?.reduce((max, member) => 
        Math.max(max, member.order_index || 0), 0) || 0;

      const { data, error } = await supabase
        .from("team_members")
        .insert({
          name: newMember.name || '',
          role: newMember.role || 'REDACTRICE',
          image: newMember.image,
          order_index: newMember.order_index || maxOrder + 1
        })
        .select();

      if (error) {
        console.error("Error in create mutation:", error);
        throw error;
      }
      
      return data;
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
      console.log("Updating team member:", member);
      
      const { error } = await supabase
        .from("team_members")
        .update({
          name: member.name,
          role: member.role,
          image: member.image,
          order_index: member.order_index
        })
        .eq("id", member.id);

      if (error) {
        console.error("Error in update mutation:", error);
        throw error;
      }
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
      console.log("Deleting team member with ID:", id);
      
      const member = teamMembers?.find(m => m.id === id);
      if (member?.image) {
        try {
          // Extract the filename from the image URL or path
          const fileName = member.image.split('/').pop();
          if (fileName) {
            console.log("Deleting image file:", fileName);
            const { error: deleteImageError } = await supabase.storage
              .from('team_images')
              .remove([fileName]);
              
            if (deleteImageError) {
              console.error("Error deleting image:", deleteImageError);
              // Continue with member deletion even if image deletion fails
            }
          }
        } catch (imageError) {
          console.error("Error handling image deletion:", imageError);
          // Continue with member deletion even if image handling fails
        }
      }

      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error in delete mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Membre supprimé avec succès");
      setMemberToDelete(null);
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      console.error("Error deleting team member:", error);
      toast.error("Erreur lors de la suppression du membre");
      setMemberToDelete(null);
      setShowDeleteDialog(false);
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

  const handleDeleteClick = useCallback((id: string) => {
    setMemberToDelete(id);
    setShowDeleteDialog(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!memberToDelete) return;
    try {
      await deleteMutation.mutateAsync(memberToDelete);
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  }, [memberToDelete, deleteMutation]);

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
              onImageUpload={handleImageUpload}
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
                onImageUpload={handleImageUpload}
              />
            </Card>
          ) : (
            <TeamMemberCard
              key={member.id}
              member={member}
              onEdit={(member) => setEditingId(member.id)}
              onDelete={handleDeleteClick}
            />
          )
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Êtes-vous sûr de vouloir supprimer ce membre de l'équipe?</p>
            <p className="text-sm text-muted-foreground mt-2">Cette action est irréversible.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
