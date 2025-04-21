import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, Eye, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArticlesTableDisplay } from "./ArticlesTableDisplay";
import { ArticlesSearchBar } from "./ArticlesSearchBar";
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
        // Query all articles for admin users or only user's own articles
        let query = supabase
          .from("articles")
          .select("*")
          .order("created_at", { ascending: false });
          
        // If you want to limit to only the user's own articles, uncomment this:
        // query = query.eq("author", session.user.id);

        const { data, error } = await query;

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

      <ArticlesSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {!filteredArticles?.length ? (
        <div className="text-center">Aucun article trouvé.</div>
      ) : (
        <ArticlesTableDisplay
          articles={filteredArticles}
          onEdit={id => navigate(`/edit-article/${id}`)}
          onDelete={id => deleteArticleMutation.mutate(id)}
        />
      )}
    </div>
  );
};
