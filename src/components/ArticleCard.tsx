
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Article } from "@/types/article";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { LikeButton } from "./LikeButton";

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard = ({ article }: ArticleCardProps) => {
  return (
    <Link to={`/articles/${article.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{article.date}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {article.author_name || 'Anonymous'}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Eye size={16} />
                <span>{article.views || 0}</span>
              </div>
              <LikeButton articleId={article.id} initialLikes={article.likes || 0} />
            </div>
          </div>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          <CardDescription className="line-clamp-3">
            {article.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-sm px-3 py-1 bg-secondary rounded-full">
              {article.category}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
