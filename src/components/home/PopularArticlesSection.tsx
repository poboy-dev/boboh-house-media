
import React from "react";
import { RecentArticleCard } from "./RecentArticleCard";
import { Article } from "@/types/article";

interface PopularArticlesSectionProps {
  articles: Article[] | undefined;
  isLoading: boolean;
}

export const PopularArticlesSection: React.FC<PopularArticlesSectionProps> = ({
  articles,
  isLoading,
}) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16 text-primary">Posts Populaires</h2>
        {isLoading ? (
          <div className="w-full flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles?.map((article) => (
              <RecentArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
