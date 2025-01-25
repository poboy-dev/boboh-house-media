import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { testTableAccess } from "@/services/supabase";
import { Navbar } from "@/components/layout/Navbar";

const Index = () => {
  useEffect(() => {
    // Test table access when component mounts
    testTableAccess().then((result) => {
      console.log('Table access test results:', result);
    }).catch((error) => {
      console.error('Error testing table access:', error);
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
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

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Notre Équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* CEO */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/remy ceo.jpeg" 
                  alt="Rémy Meva'a"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rémy Meva'a</h3>
              <p className="text-gray-600">CEO</p>
            </div>

            {/* DG */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/Dany Dg.jpeg" 
                  alt="Danielle ETONDE"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Danielle ETONDE</h3>
              <p className="text-gray-600">Directrice Générale</p>
            </div>

            {/* SG */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/jarida SG.jpeg" 
                  alt="NGOUTANE Jarida"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">NGOUTANE Jarida</h3>
              <p className="text-gray-600">SECRETAIRE GENERALE</p>
            </div>

            {/* Redactrice */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/marie redactrice.jpeg" 
                  alt="KELAH Marie"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">KELAH Marie</h3>
              <p className="text-gray-600">REDACTRICE</p>
            </div>

            {/* Communicatrice 1 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/michel counicatrice.jpeg" 
                  alt="DEUMANI Michelle"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">DEUMANI Michelle</h3>
              <p className="text-gray-600">COMMUNICATRICE</p>
            </div>

            {/* Communicatrice 2 */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/aicha comunication.jpeg" 
                  alt="AICHATOU DJOUMAI"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">AICHATOU DJOUMAI</h3>
              <p className="text-gray-600">COMMUNICATRICE</p>
            </div>

            {/* Communicateur */}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
              <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                <img 
                  src="/image/Yan comuniction.jpeg" 
                  alt="YAN YOLI YOLI"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">YAN YOLI YOLI</h3>
              <p className="text-gray-600">COMMUNICATEUR</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
