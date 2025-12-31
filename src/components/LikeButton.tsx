import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate or get visitor ID for anonymous users
  const getVisitorId = () => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    return visitorId;
  };

  // Check if the user has already liked this article using secure RPC
  useEffect(() => {
    const checkIfLiked = async () => {
      setIsLoading(true);
      try {
        const visitorId = getVisitorId();
        const { data, error } = await supabase
          .rpc('check_user_liked_article', { 
            p_article_id: articleId, 
            p_user_id: visitorId 
          });

        if (error) throw error;
        setIsLiked(data === true);
      } catch (error) {
        console.error('Error checking like status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfLiked();
  }, [articleId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    e.stopPropagation(); // Stop event bubbling
    
    if (isLoading) return;
    
    setIsLoading(true);
    const visitorId = getVisitorId();
    
    try {
      // Use secure RPC function to toggle like
      const { data: nowLiked, error } = await supabase
        .rpc('toggle_article_like', { 
          p_article_id: articleId, 
          p_user_id: visitorId 
        });

      if (error) throw error;
      
      if (nowLiked) {
        setLikes(prev => prev + 1);
        setIsLiked(true);
      } else {
        setLikes(prev => prev - 1);
        setIsLiked(false);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likes}</span>
    </Button>
  );
};
