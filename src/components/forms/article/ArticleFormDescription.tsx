import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormSchema } from "./schema";

interface ArticleFormDescriptionProps {
  form: UseFormReturn<ArticleFormSchema>;
}

export const ArticleFormDescription = ({ form }: ArticleFormDescriptionProps) => {
  return (
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
  );
};