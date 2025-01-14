import { Article, ArticleCategory } from "@/types/article";
import { ArticleCard } from "./ArticleCard";

interface ArticlesListProps {
  articles: Article[];
  category?: ArticleCategory;
}

export const ArticlesList = ({ articles, category }: ArticlesListProps) => {
  const filteredArticles = category
    ? articles.filter((article) => article.category === category)
    : articles;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredArticles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};