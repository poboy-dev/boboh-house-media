import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { Article } from "@/types/article";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  content: z.string().min(1, "Le contenu est requis"),
  category: z.enum(["portfolio", "bobohgeek", "bh-association"]),
  image: z.string().min(1, "L'URL de l'image est requise"),
  date: z.string().min(1, "La date est requise"),
});

interface ArticleFormProps {
  initialData?: Article;
}

export const ArticleForm = ({ initialData }: ArticleFormProps) => {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!session?.user?.id) throw new Error("User not authenticated");

      const articleData = {
        ...values,
        author: session.user.id,
      };

      if (initialData) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", initialData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert([articleData]);
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
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Error saving article:", error);
      toast.error("Erreur lors de la sauvegarde de l'article");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de l'article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description courte de l'article"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contenu de l'article"
                  className="min-h-[300px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="portfolio">Portfolio</SelectItem>
                  <SelectItem value="bobohgeek">BobOh Geek</SelectItem>
                  <SelectItem value="bh-association">BH Association</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="URL de l'image" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </form>
    </Form>
  );
};