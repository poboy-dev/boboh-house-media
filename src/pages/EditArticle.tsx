import { ArticleForm } from "@/components/ArticleForm";
import { Helmet, HelmetProvider } from "react-helmet-async";
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
    <HelmetProvider>
      <Helmet>
        <title>{article.title} | Boboh House</title>
        <meta name="description" content={article.description} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.description} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.description} />
        <meta name="twitter:image" content={article.image} />
      </Helmet>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Modifier l'article</h1>
        <ArticleForm initialData={article} />
      </div>
    </HelmetProvider>
  );
};

export default EditArticle;