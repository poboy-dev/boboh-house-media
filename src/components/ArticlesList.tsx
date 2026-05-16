import { useMemo, useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { ArticleCard } from "./ArticleCard";
import { getArticles } from "@/services/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ArticlesListProps {
  category?: string;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export const ArticlesList = ({ category }: ArticlesListProps) => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles", category],
    queryFn: () => getArticles(category),
  });

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    if (!articles) return [];
    if (!debounced) return articles;
    const q = normalize(debounced);
    return articles.filter((a) => {
      const haystack = normalize(`${a.title ?? ""} ${a.description ?? ""}`);
      return haystack.includes(q);
    });
  }, [articles, debounced]);

  if (isLoading) {
    return <LoadingSpinner size={48} className="my-12" />;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Erreur lors du chargement des articles.
      </div>
    );
  }

  const total = articles?.length ?? 0;
  const count = filtered.length;

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article…"
            className="pl-9 pr-9"
            aria-label="Rechercher un article"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {debounced
            ? `${count} résultat${count > 1 ? "s" : ""} pour "${debounced}"`
            : `${total} article${total > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Results */}
      {total === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Aucun article trouvé.
        </div>
      ) : count === 0 ? (
        <div className="text-center py-12 space-y-4">
          <p className="text-muted-foreground">
            Aucun article ne correspond à votre recherche.
          </p>
          <Button variant="outline" onClick={() => setQuery("")}>
            Réinitialiser
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};
