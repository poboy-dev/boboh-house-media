import { Card } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      title: "Couverture Evenementiel",
      description: "Des vidéos professionnelles qui captent l'attention et transmettent votre message avec impact.",
      features: ["Vidéos corporatives", "Films publicitaires", "Contenu pour réseaux sociaux", "Événements en direct"],
      image: "https://www.informateurjudiciaire.fr/wp-content/uploads/sites/10/2022/05/shutterstock_2143492009-e1653491780943-760x396-c-default.jpg"
    },
    {
      title: "Communication",
      description: "Des images de haute qualité qui racontent votre histoire et mettent en valeur votre marque.",
      features: ["Placement de produit", "Événementiel", "Shooting produits", "Campagne publicitaires"],
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0"
    },
    {
      title: "Infographie",
      description: "Un travail de finition expert pour donner à vos projets un aspect professionnel et impactant.",
      features: ["Graphic Design", "Video montage", "Animation", "Effets spéciaux"],
      image: "https://www.mjm-design.com/assets/images/builder/article/INFOGRAPHIE_LOGICIELS_MJM_GRAPHIC_DESIGN.jpg"
    },
    {
      title: "Community and Social Management",
      description: "Des stratégies de contenu optimisées pour maximiser votre présence en ligne.",
      features: ["Stratégie de contenu", "Gestion réseaux sociaux", "Development des communauter", "Analyse des performances"],
      image: "https://media.licdn.com/dms/image/D5612AQG6_R0Ty-BuGg/article-cover_image-shrink_720_1280/0/1682365640665"
    },
    {
      title: "Formation en Art Oratoire",
      description: "Développez vos compétences en communication orale et gagnez en confiance.",
      features: ["Ateliers", "Coaching Individuel", "Cours en ligne", "Club de Debats", "Networking"],
      image: "https://cibul.s3.amazonaws.com/4b2cd3ba9a534145922e3f8e4bd5e392.base.image.jpg"
    },
    {
      title: "Media",
      description: "Un travail de finition expert pour donner à vos projets un aspect professionnel et impactant.",
      features: ["Redaction d'article", "Publisreportage", "Portrait", "Chronique", "Reportage"],
      image: "https://www.taurillon.org/local/cache-gd2/30/0c878cc1383f8f7a687b5e5ed1b706.jpg?1699622861"
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">Nos Services</h1>
        <p className="text-lg text-muted-foreground">Découvrez notre gamme complète de services de production audiovisuelle professionnelle</p>
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="h-48 overflow-hidden">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 text-foreground">{service.title}</h3>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-muted-foreground">
                    <span className="text-primary mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors">
                Demander un devis
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;