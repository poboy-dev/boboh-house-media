import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { Eye, Heart, Users, Briefcase, FileText, TrendingUp, Award } from "lucide-react";

export const DashboardStats = () => {
  const isMobile = useIsMobile();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      // Fetch articles for views, likes and top content
      const { data: articles, error: articlesError } = await supabase
        .from("articles")
        .select("id, title, category, views, likes, created_at")
        .order('views', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch counts for services and team
      const { count: servicesCount } = await supabase
        .from("services")
        .select("*", { count: 'exact', head: true });

      const { count: teamCount } = await supabase
        .from("team_members")
        .select("*", { count: 'exact', head: true });

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
      const avgEngagement = totalViews > 0 ? (totalLikes / totalViews * 100).toFixed(1) : "0";

      return {
        categoryStats,
        totalViews,
        totalLikes,
        servicesCount: servicesCount || 0,
        teamCount: teamCount || 0,
        articlesCount: articles.length,
        avgEngagement,
        topArticles: articles.slice(0, 5),
        chartData: Object.entries(categoryStats).map(([name, { count, views, likes }]) => ({
          name: name.length > 10 ? name.substring(0, 10) + '...' : name,
          full_name: name,
          articles: count,
          views,
          likes,
        })),
      };
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  const mainStats = [
    {
      label: "Vues totales",
      value: stats?.totalViews,
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "Toutes pages confondues"
    },
    {
      label: "Likes totaux",
      value: stats?.totalLikes,
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-500/10",
      description: "Engagement global"
    },
    {
      label: "Engagement",
      value: `${stats?.avgEngagement}%`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "Ratio Like/Vue"
    },
    {
      label: "Articles",
      value: stats?.articlesCount,
      icon: FileText,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Publiés"
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading">Aperçu Analytique</h2>
      </div>

      {/* Main KPI Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {mainStats.map((stat, i) => (
          <div key={i} className="glass-card p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                < Award size={18} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Performance par Catégorie</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'currentColor', opacity: 0.6 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      fontSize: '13px'
                    }}
                  />
                  <Bar dataKey="views" radius={[6, 6, 0, 0]} name="Vues">
                    {stats?.chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Summary Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Services Proposés</p>
                <p className="text-xl font-bold">{stats?.servicesCount}</p>
              </div>
            </div>
            <div className="glass-card p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membres Équipe</p>
                <p className="text-xl font-bold">{stats?.teamCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Articles Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <TrendingUp size={18} />
              </div>
              <h3 className="text-lg font-semibold font-heading">Top Articles</h3>
            </div>
            <div className="space-y-5 flex-1">
              {stats?.topArticles.map((article, i) => (
                <div key={article.id} className="group cursor-pointer">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-1 uppercase tracking-wider">
                        {article.category}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs font-bold">{article.views || 0}</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-right">vues</span>
                    </div>
                  </div>
                  {i < (stats?.topArticles.length - 1) && (
                    <div className="h-px w-full bg-border/50 mt-4" />
                  )}
                </div>
              ))}
            </div>
            <button className="w-full py-3 mt-6 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-xs font-semibold transition-colors">
              Voir tous les articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
