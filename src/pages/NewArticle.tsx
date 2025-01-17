import { ArticleForm } from "@/components/ArticleForm";

const NewArticle = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer un nouvel article</h1>
      <ArticleForm />
    </div>
  );
};

export default NewArticle;