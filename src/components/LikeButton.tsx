
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LikeButtonProps {
  articleId: string;
  initialLikes: number;
}

export const LikeButton = ({ articleId, initialLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        const { error } = await supabase
          .from('article_likes')
          .delete()
          .match({ article_id: articleId, user_id: window.sessionStorage.getItem('visitor_id') || 'anonymous' });

        if (error) throw error;
        setLikes(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('article_likes')
          .insert({
            article_id: articleId,
            user_id: window.sessionStorage.getItem('visitor_id') || 'anonymous'
          });

        if (error) throw error;
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Une erreur s'est produite");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
      onClick={handleLike}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likes}</span>
    </Button>
  );
};
