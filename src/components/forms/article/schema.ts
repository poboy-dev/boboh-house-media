
import { z } from "zod";

export const articleFormSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  content: z.string().min(1, "Le contenu est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  image: z.string().min(1, "L'URL de l'image est requise"),
  date: z.string().min(1, "La date est requise"),
});

export type ArticleFormSchema = z.infer<typeof articleFormSchema>;
