
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Article } from "@/types/article";

export const usePopularArticles = (limit: number = 3) => {
  const { data: popularArticles, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["popular-articles", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("likes", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching popular articles:", error);
        throw error;
      }
      return data as Article[];
    }
  });

  return { popularArticles, isLoadingPopular };
};
