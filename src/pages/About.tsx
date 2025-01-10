import { Card } from "@/components/ui/card";

const About = () => {
  const timeline = [
    {
      year: "2022",
      title: "Création de Boboh House Media",
      description: "Lancement de l'agence avec une équipe passionnée et créative."
    },
    {
      year: "2023",
      title: "Couverture evenements Otaku",
      description: "Couverture du KOF 2023"
    },
    {
      year: "2024",
      title: "Innovation Digitale",
      description: "Intégration des dernières technologies pour des expériences immersives."
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <section className="bg-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Notre Histoire</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Boboh House Media est né d'une passion pour la culture camerounaise et d'une vision audacieuse : "Promouvoir la culture et la consommation locale".
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-bullseye"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Notre Mission</h3>
            <p className="text-gray-600">
              Être le carrefour de la culture camerounaise, vendre nos artistes et nos événements aux yeux du monde.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-heart"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Nos Valeurs</h3>
            <p className="text-gray-600">
              Créativité, excellence et engagement culturel sont au cœur de notre approche.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="text-[#E74C3C] text-3xl mb-4">
              <i className="fas fa-lightbulb"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">Notre Vision</h3>
            <p className="text-gray-600">
              Devenir la référence sûre en terme d'information culturelle.
            </p>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Parcours</h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex mb-8">
                <div className="w-24 flex-shrink-0">
                  <div className="text-[#E74C3C] font-bold">{item.year}</div>
                </div>
                <div className="border-l-2 border-[#E74C3C] pl-8">
                  <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;