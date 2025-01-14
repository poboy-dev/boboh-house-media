import { ArticlesList } from "@/components/ArticlesList";

const BobohGeek = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Boboh Geek</h1>
      <ArticlesList category="bobohgeek" />
    </div>
  );
};

export default BobohGeek;