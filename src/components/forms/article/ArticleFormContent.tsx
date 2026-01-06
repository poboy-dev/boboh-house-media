import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
            <RichTextEditor
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="Écrivez votre article ici..."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};