
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { ImagePicker } from "@/components/ui/image-picker";
import { useState } from "react";

interface ArticleFormProps {
  initialData?: Article;
  onSuccess?: () => void;
}

export const ArticleForm = ({ initialData, onSuccess }: ArticleFormProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

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

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('articles')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('articles')
        .getPublicUrl(filePath);

      form.setValue('image', publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: ArticleFormSchema) => {
      if (!session?.user?.id) {
        toast.error("Vous devez être connecté pour créer un article");
        throw new Error("User not authenticated");
      }

      // Ensure all required fields are present and properly typed
      const articleData = {
        title: values.title,
        description: values.description,
        content: values.content,
        category: values.category,
        image: values.image,
        date: values.date,
        author: session.user.id,
        views: initialData?.views || 0, // Include views field with default value
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
          .insert(articleData);
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
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <ImagePicker
              onChange={handleImageUpload}
              value={form.watch('image')}
              onRemove={() => form.setValue('image', '')}
              loading={isUploading}
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...form.register("date")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
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
