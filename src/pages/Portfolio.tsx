import { ArticlesList } from "@/components/ArticlesList";
import { Article } from "@/types/article";

const Portfolio = () => {
  // Exemple d'articles - À remplacer par vos vrais articles
  const articles: Article[] = [
    {
      id: "1",
      title: "Couverture du KOF 2023",
      description: "Reportage photo et vidéo du Kamer Open Festival 2023",
      content: "Contenu détaillé de l'article...",
      category: "portfolio",
      image: "https://example.com/kof2023.jpg",
      date: "2023-08-15",
      author: "Boboh House Media"
    },
    // Ajoutez plus d'articles ici
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Portfolio</h1>
      <ArticlesList articles={articles} category="portfolio" />
    </div>
  );
};

export default Portfolio;