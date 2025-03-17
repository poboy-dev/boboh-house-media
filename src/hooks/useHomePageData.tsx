
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { Article } from "@/types/article";

export const useHomePageData = () => {
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
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

  const { data: recentArticles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["recent-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching recent articles:", error);
        throw error;
      }
      
      return data as Article[];
    }
  });

  return {
    teamMembers,
    isLoadingTeam,
    recentArticles,
    isLoadingArticles
  };
};
