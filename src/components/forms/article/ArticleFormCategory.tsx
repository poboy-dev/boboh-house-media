import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormSchema } from "./schema";

interface ArticleFormCategoryProps {
  form: UseFormReturn<ArticleFormSchema>;
}

export const ArticleFormCategory = ({ form }: ArticleFormCategoryProps) => {
  return (
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
  );
};