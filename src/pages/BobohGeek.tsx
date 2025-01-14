import { ArticlesList } from "@/components/ArticlesList";
import { Article } from "@/types/article";

const BobohGeek = () => {
  const articles: Article[] = [
    {
      id: "2",
      title: "Les dernières tendances tech au Cameroun",
      description: "Découvrez les innovations technologiques qui façonnent le Cameroun",
      content: "Contenu détaillé de l'article...",
      category: "bobohgeek",
      image: "https://example.com/tech-trends.jpg",
      date: "2024-01-20",
      author: "Boboh Geek"
    },
    // Ajoutez plus d'articles ici
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Boboh Geek</h1>
      <ArticlesList articles={articles} category="bobohgeek" />
    </div>
  );
};

export default BobohGeek;