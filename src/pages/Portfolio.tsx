import { ArticlesList } from "@/components/ArticlesList";

const Portfolio = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
      <ArticlesList category="portfolio" />
    </div>
  );
};

export default Portfolio;