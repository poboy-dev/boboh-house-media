
import { useParams } from "react-router-dom";
import { ArticlesList } from "@/components/ArticlesList";

const CategoryArticles = () => {
  const { slug } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 capitalize">{slug?.replace(/-/g, ' ')}</h1>
      <ArticlesList category={slug} />
    </div>
  );
};

export default CategoryArticles;
