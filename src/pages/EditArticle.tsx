import { ArticleForm } from "@/components/ArticleForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";
import { useParams } from "react-router-dom";

const EditArticle = () => {
  const { id } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      console.log("Fetching article:", id);
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching article:", error);
        throw error;
      }
      console.log("Article fetched:", data);
      return data as Article;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!article) {
    return <div className="container mx-auto p-6">Article not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Modifier l'article</h1>
      <ArticleForm initialData={article} />
    </div>
  );
};

export default EditArticle;