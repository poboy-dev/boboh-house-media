
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Article } from "@/types/article";

interface RecentArticleCardProps {
  article: Article;
}

const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine${diffDays >= 14 ? 's' : ''}`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return new Date(dateString).toLocaleDateString("fr-FR");
};

export const RecentArticleCard: React.FC<RecentArticleCardProps> = ({ article }) => {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50 dark:border dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={article.image || "/placeholder.svg"}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Category badge */}
        {article.category && (
          <span className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {article.category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-muted-foreground dark:text-zinc-400 text-sm mb-3">
            <Clock className="w-3.5 h-3.5" />
            {getRelativeTime(article.created_at)}
          </div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-300 font-heading text-neutral-900 dark:text-white">
            {article.title}
          </h3>
          <p className="text-muted-foreground dark:text-zinc-300 text-sm line-clamp-3 leading-relaxed">
            {article.description}
          </p>
        </div>

        {/* Read more */}
        <div className="flex items-center gap-1.5 text-primary text-sm font-medium mt-4 group-hover:gap-2.5 transition-all duration-300">
          Lire plus
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};
