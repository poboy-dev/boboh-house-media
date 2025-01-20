import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormSchema } from "./schema";

interface ArticleFormTitleProps {
  form: UseFormReturn<ArticleFormSchema>;
}

export const ArticleFormTitle = ({ form }: ArticleFormTitleProps) => {
  return (
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
  );
};