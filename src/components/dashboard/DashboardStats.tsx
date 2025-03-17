
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

export const DashboardStats = () => {
  const isMobile = useIsMobile();
  
  const { data: stats } = useQuery({
    queryKey: ["articleStats"],
    queryFn: async () => {
      const { data: articles, error } = await supabase
        .from("articles")
        .select("category, views, likes");

      if (error) throw error;

      const categoryStats = articles.reduce((acc: Record<string, { count: number; views: number; likes: number }>, article) => {
        const category = article.category || "Non catégorisé";
        if (!acc[category]) {
          acc[category] = { count: 0, views: 0, likes: 0 };
        }
        acc[category].count += 1;
        acc[category].views += article.views || 0;
        acc[category].likes += article.likes || 0;
        return acc;
      }, {});

      const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
      const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0);

      return {
        categoryStats,
        totalViews,
        totalLikes,
        chartData: Object.entries(categoryStats).map(([name, { count, views, likes }]) => ({
          name: isMobile ? name.substring(0, 5) + '...' : name,
          articles: count,
          views,
          likes,
        })),
      };
    },
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistiques</h2>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Vues totales</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Nombre total de vues pour tous les articles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{stats?.totalViews || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Likes totaux</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Nombre total de likes pour tous les articles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{stats?.totalLikes || 0}</p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl">Articles par catégorie</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Distribution des articles et vues par catégorie</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats?.chartData} 
                margin={{ top: 5, right: 5, left: isMobile ? -25 : 0, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: isMobile ? 10 : 12 }} />
                <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                <Tooltip />
                <Bar dataKey="articles" fill="hsl(var(--primary))" name="Articles" />
                <Bar dataKey="views" fill="hsl(var(--secondary))" name="Vues" />
                <Bar dataKey="likes" fill="hsl(var(--accent))" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
