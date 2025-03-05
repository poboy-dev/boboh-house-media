
import { useParams } from "react-router-dom";
import { ArticlesList } from "@/components/ArticlesList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CategoryArticles = () => {
  const { slug } = useParams();
  
  const { data: category, isLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from("article_categories")
        .select("name")
        .eq("slug", slug)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  if (!slug || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Catégorie non trouvée</h1>
        <p>La catégorie demandée n'existe pas.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">{category.name}</h1>
      <ArticlesList category={slug} />
    </div>
  );
};

export default CategoryArticles;
