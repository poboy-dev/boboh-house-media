import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section min-h-screen flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Media Culturel
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in">
            La culture 237, c'est nous
          </p>
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
            <Link to="/contact">Commencez votre projet</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="service-card">
              <i className="fas fa-video text-4xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-3">Couverture Evenementiel</h3>
              <p className="text-gray-600">
                Création de contenu vidéo professionnel pour tous vos besoins
              </p>
            </div>
            
            <div className="service-card">
              <i className="fas fa-camera text-4xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-3">Communication</h3>
              <p className="text-gray-600">
                Capturez vos moments importants avec notre expertise photographique
              </p>
            </div>
            
            <div className="service-card">
              <i className="fas fa-film text-4xl text-secondary mb-4"></i>
              <h3 className="text-xl font-semibold mb-3">Maitre de ceremonie</h3>
              <p className="text-gray-600">
                Animation professionnelle pour vos événements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">À Propos de BobohHouse Media</h2>
            <p className="text-gray-600 mb-6">
              Nous sommes une équipe passionnée de créatifs dédiés à la production de contenu audiovisuel de haute qualité. 
              Notre objectif est de transformer vos idées en réalité visuelle impactante.
            </p>
            <Button asChild variant="secondary">
              <Link to="/about">En savoir plus</Link>
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/team-image.jpg" 
              alt="Notre équipe" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;