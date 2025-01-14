import { ArticlesList } from "@/components/ArticlesList";
import { Article } from "@/types/article";

const BHAssociation = () => {
  const articles: Article[] = [
    {
      id: "3",
      title: "Actions sociales 2024",
      description: "Découvrez nos projets sociaux pour l'année 2024",
      content: "Contenu détaillé de l'article...",
      category: "bh-association",
      image: "https://example.com/social-actions.jpg",
      date: "2024-01-15",
      author: "BH Association"
    },
    // Ajoutez plus d'articles ici
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">BH Association</h1>
      <ArticlesList articles={articles} category="bh-association" />
    </div>
  );
};

export default BHAssociation;