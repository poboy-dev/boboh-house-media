
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Category {
  id: string;
  slug: string;
  name: string;
}

export const CategoryManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("article_categories")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Category[];
    },
  });

  const addCategory = useMutation({
    mutationFn: async () => {
      const slug = newCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { error } = await supabase
        .from("article_categories")
        .insert({ name: newCategoryName, slug });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsAddDialogOpen(false);
      setNewCategoryName("");
      toast.success("Catégorie ajoutée avec succès");
    },
    onError: (error) => {
      console.error("Error adding category:", error);
      toast.error("Erreur lors de l'ajout de la catégorie");
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const { error } = await supabase
        .from("article_categories")
        .update({ name, slug })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setEditCategoryName("");
      toast.success("Catégorie mise à jour avec succès");
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast.error("Erreur lors de la mise à jour de la catégorie");
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from("article_categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Catégorie supprimée avec succès");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Erreur lors de la suppression de la catégorie");
    },
  });

  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des catégories</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Ajouter une catégorie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addCategory.mutate();
              }}
              className="space-y-4"
            >
              <Input
                placeholder="Nom de la catégorie"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <Button type="submit" disabled={addCategory.isPending}>
                {addCategory.isPending ? "Ajout en cours..." : "Ajouter"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier la catégorie</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingCategory) {
                  updateCategory.mutate({ id: editingCategory.id, name: editCategoryName });
                }
              }}
              className="space-y-4"
            >
              <Input
                placeholder="Nom de la catégorie"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={updateCategory.isPending}>
                  {updateCategory.isPending ? "Mise à jour..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="w-full flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(category)}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
                        deleteCategory.mutate(category.id);
                      }
                    }}
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
