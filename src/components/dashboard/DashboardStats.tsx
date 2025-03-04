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

export const DashboardStats = () => {
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
          name,
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
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vues totales</CardTitle>
            <CardDescription>Nombre total de vues pour tous les articles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalViews || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Likes totaux</CardTitle>
            <CardDescription>Nombre total de likes pour tous les articles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalLikes || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Articles par catégorie</CardTitle>
            <CardDescription>Distribution des articles et vues par catégorie</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="articles" fill="hsl(var(--primary))" name="Articles" />
                <Bar dataKey="views" fill="hsl(var(--secondary))" name="Vues" />
                <Bar dataKey="likes" fill="hsl(var(--tertiary))" name="Likes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
