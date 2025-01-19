import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ArticlesTable = () => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["userArticles"],
    queryFn: async () => {
      console.log("Fetching user articles...");
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("author", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
      console.log("Articles fetched:", data);
      return data as Article[];
    },
    enabled: !!session?.user,
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Articles</h2>
        <Button onClick={() => navigate("/new-article")} className="flex items-center gap-2">
          <Plus size={16} />
          Nouvel article
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Chargement des articles...</div>
      ) : !articles?.length ? (
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
            {articles.map((article) => (
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
                    <Edit size={16} />
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