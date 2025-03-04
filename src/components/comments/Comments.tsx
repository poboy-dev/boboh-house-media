
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { toast } from "sonner";

interface CommentsProps {
  articleId: string;
}

export const Comments = ({ articleId }: CommentsProps) => {
  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: true });

      if (error) {
        toast.error("Erreur lors du chargement des commentaires");
        throw error;
      }

      return data;
    },
  });

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-2xl font-bold">Commentaires</h2>
      <CommentForm articleId={articleId} onCommentAdded={refetch} />
      <CommentList comments={comments || []} />
    </div>
  );
};
