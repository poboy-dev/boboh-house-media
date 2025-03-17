
import React from "react";
import { RecentArticleCard } from "./RecentArticleCard";
import { Article } from "@/types/article";

interface RecentArticlesSectionProps {
  articles: Article[] | undefined;
  isLoading: boolean;
}

export const RecentArticlesSection: React.FC<RecentArticlesSectionProps> = ({ 
  articles, 
  isLoading 
}) => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-16">Articles Récents</h2>
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
