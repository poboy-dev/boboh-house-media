import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormSchema } from "./schema";

interface ArticleFormContentProps {
  form: UseFormReturn<ArticleFormSchema>;
}

export const ArticleFormContent = ({ form }: ArticleFormContentProps) => {
  return (
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
  );
};