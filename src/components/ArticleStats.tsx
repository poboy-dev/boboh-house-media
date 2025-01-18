import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const ArticleStats = () => {
  const { data: articlesByCategory } = useQuery({
    queryKey: ["articlesByCategory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("category")
        .not("category", "is", null);

      if (error) throw error;

      const categories = data.reduce((acc: Record<string, number>, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(categories).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistiques des articles</CardTitle>
        <CardDescription>
          Distribution des articles par catégorie
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer config={{
          value: {
            color: "hsl(var(--primary))",
          },
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={articlesByCategory}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Catégorie
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0]?.payload?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Articles
                        </span>
                        <span className="font-bold">
                          {payload[0]?.value || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }} />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};