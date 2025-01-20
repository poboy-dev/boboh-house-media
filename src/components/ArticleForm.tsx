import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { Article } from "@/types/article";
import { ArticleFormTitle } from "./forms/article/ArticleFormTitle";
import { ArticleFormDescription } from "./forms/article/ArticleFormDescription";
import { ArticleFormContent } from "./forms/article/ArticleFormContent";
import { ArticleFormCategory } from "./forms/article/ArticleFormCategory";
import { articleFormSchema, ArticleFormSchema } from "./forms/article/schema";

interface ArticleFormProps {
  initialData?: Article;
  onSuccess?: () => void;
}

export const ArticleForm = ({ initialData, onSuccess }: ArticleFormProps) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const form = useForm<ArticleFormSchema>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      content: "",
      category: "portfolio",
      image: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ArticleFormSchema) => {
      if (!session?.user?.id) {
        toast.error("Vous devez être connecté pour créer un article");
        throw new Error("User not authenticated");
      }

      const articleData = {
        ...values,
        author: session.user.id,
      };

      console.log("Saving article with data:", articleData);

      if (initialData) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("articles")
          .insert([articleData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userArticles"] });
      toast.success(
        initialData
          ? "Article modifié avec succès"
          : "Article créé avec succès"
      );
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error("Error saving article:", error);
      toast.error("Erreur lors de la sauvegarde de l'article");
    },
  });

  const onSubmit = (values: ArticleFormSchema) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ArticleFormTitle form={form} />
        <ArticleFormDescription form={form} />
        <ArticleFormContent form={form} />
        <ArticleFormCategory form={form} />

        <div className="space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <Input
              id="image"
              {...form.register("image")}
              placeholder="URL de l'image"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
            />
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
};