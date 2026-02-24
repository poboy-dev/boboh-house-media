import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useQuery } from '@tanstack/react-query';
import { Article } from '@/types/article';
import { ArticleCard } from './ArticleCard';
import { getArticles } from '@/services/supabase';

interface ArticlesListProps {
  category?: string;
}

export const ArticlesList = ({ category }: ArticlesListProps) => {
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles', category],
    queryFn: () => getArticles(category),
  });

  if (isLoading) {
    return <LoadingSpinner size={48} className="my-12" />;
  }

  if (error) {
    return <div className="text-center text-red-500">Erreur lors du chargement des articles.</div>;
  }

  if (!articles || articles.length === 0) {
    return <div className="text-center">Aucun article trouvé.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
