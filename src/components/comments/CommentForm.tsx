
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CommentFormProps {
  articleId: string;
  onCommentAdded: () => void;
}

export const CommentForm = ({ articleId, onCommentAdded }: CommentFormProps) => {
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        author_name: authorName.trim(),
        content: content.trim(),
      });

      if (error) throw error;

      toast.success("Commentaire ajouté avec succès");
      setAuthorName("");
      setContent("");
      onCommentAdded();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du commentaire");
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Votre nom"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="max-w-md"
        />
      </div>
      <div>
        <Textarea
          placeholder="Votre commentaire"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi..." : "Publier le commentaire"}
      </Button>
    </form>
  );
};
