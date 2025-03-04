
import { useParams } from "react-router-dom";
import { ArticlesList } from "@/components/ArticlesList";
import { ArticleCategory } from "@/types/article";

const CategoryArticles = () => {
  const { slug } = useParams();
  
  // Validate that the slug is a valid ArticleCategory
  const isValidCategory = (category: string | undefined): category is ArticleCategory => {
    return category === 'portfolio' || category === 'bobohgeek' || category === 'bh-association';
  };

  if (!slug || !isValidCategory(slug)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Category Not Found</h1>
        <p>The requested category does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{slug.replace(/-/g, ' ')}</h1>
      <ArticlesList category={slug} />
    </div>
  );
};

export default CategoryArticles;
