
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Article } from "@/types/article";

interface RecentArticleCardProps {
  article: Article;
}

export const RecentArticleCard: React.FC<RecentArticleCardProps> = ({ article }) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">
            {new Date(article.created_at).toLocaleDateString()}
          </p>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {article.description}
          </p>
        </div>
        <div className="flex justify-between items-center mt-4">
          {article.category && (
            <Link 
              to={`/category/${article.category}`} 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Plus d'articles {article.category}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          <Link 
            to={`/articles/${article.id}`}
            className="text-sm text-primary hover:underline"
          >
            Lire plus
          </Link>
        </div>
      </div>
    </div>
  );
};
