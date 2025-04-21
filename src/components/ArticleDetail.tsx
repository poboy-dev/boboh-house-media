
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getArticleById } from '@/services/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { Comments } from "./comments/Comments";
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LikeButton } from './LikeButton';

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id!),
    enabled: !!id,
  });

  // Mutation to increment view count
  const incrementViewMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const { error } = await supabase.rpc('increment_article_views', { article_id: articleId });
      if (error) throw error;
      // Invalidate article query to refresh data
      queryClient.invalidateQueries({ queryKey: ['article', articleId] });
    }
  });

  // Increment view count when article loads
  useEffect(() => {
    if (article?.id) {
      incrementViewMutation.mutate(article.id);
    }
  }, [article?.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
        <Skeleton className="w-32 h-6 mb-4" />
        <Skeleton className="w-full h-12 mb-4" />
        <Skeleton className="w-3/4 h-6 mb-8" />
        <div className="space-y-4">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500 text-lg">Une erreur est survenue lors du chargement de l'article.</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">Article non trouvé.</p>
      </div>
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">
          {new Date(article.date).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{article.author}</span>
          <span className="text-sm text-muted-foreground">
            {article.views || 0} vues
          </span>
          <LikeButton articleId={article.id} initialLikes={article.likes || 0} />
        </div>
      </div>
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-xl text-muted-foreground mb-8">{article.description}</p>
      <div className="prose prose-lg max-w-none">
        {article.content}
      </div>
      <Comments articleId={article.id} />
    </article>
  );
};
