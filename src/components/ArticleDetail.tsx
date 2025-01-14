import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getArticleById } from '@/services/supabase';

export const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id!),
  });

  if (isLoading) {
    return <div className="text-center py-8">Chargement de l'article...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erreur lors du chargement de l'article.</div>;
  }

  if (!article) {
    return <div className="text-center py-8">Article non trouvé.</div>;
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-muted-foreground">{article.date}</span>
        <span className="text-sm text-muted-foreground">{article.author}</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <p className="text-xl text-muted-foreground mb-8">{article.description}</p>
      <div className="prose prose-lg max-w-none">
        {article.content}
      </div>
    </article>
  );
};