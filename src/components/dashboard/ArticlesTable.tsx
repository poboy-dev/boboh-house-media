import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleForm } from "@/components/ArticleForm";

export const ArticlesTable = () => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewArticleDialogOpen, setIsNewArticleDialogOpen] = useState(false);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["userArticles", session?.user?.id],
    queryFn: async () => {
      console.log("Fetching user articles with session:", session?.user?.id);
      if (!session?.user?.id) {
        console.error("No user session found");
        throw new Error("Authentication required");
      }

      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("author", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Articles fetched successfully:", data);
        return data as Article[];
      } catch (err) {
        console.error("Error in queryFn:", err);
        throw err;
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      console.log("Deleting article:", articleId);
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", articleId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userArticles"] });
      toast.success("Article supprimé avec succès");
    },
    onError: (error) => {
      console.error("Error deleting article:", error);
      toast.error("Erreur lors de la suppression de l'article");
    },
  });

  if (!session) {
    return (
      <div className="text-center">
        Veuillez vous connecter pour accéder à vos articles.
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center">Chargement des articles...</div>;
  }

  if (error) {
    console.error("Error in component:", error);
    return (
      <div className="text-center text-red-500">
        Erreur lors du chargement des articles. Veuillez réessayer.
      </div>
    );
  }

  const filteredArticles = articles?.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSuccess = () => {
    setIsNewArticleDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["userArticles"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Articles</h2>
        <Button 
          onClick={() => setIsNewArticleDialogOpen(true)} 
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Nouvel article
        </Button>
      </div>

      <Dialog open={isNewArticleDialogOpen} onOpenChange={setIsNewArticleDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouvel article</DialogTitle>
          </DialogHeader>
          <ArticleForm onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {!filteredArticles?.length ? (
        <div className="text-center">Aucun article trouvé.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Vues</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.views}</TableCell>
                <TableCell>
                  {new Date(article.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/edit-article/${article.id}`)}
                    className="inline-flex items-center gap-2"
                  >
                    <Pencil size={16} />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteArticleMutation.mutate(article.id)}
                    className="inline-flex items-center gap-2"
                  >
                    <Trash2 size={16} />
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