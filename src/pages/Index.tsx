
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { testTableAccess } from "@/services/supabase";

const Index = () => {
  useEffect(() => {
    testTableAccess().then((result) => {
      console.log('Table access test results:', result);
    }).catch((error) => {
      console.error('Error testing table access:', error);
    });
  }, []);

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

      {/* Team Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Notre Équipe</h2>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-8 snap-x snap-mandatory scrollbar-hide">
              {/* CEO */}
              <div className="flex-none w-72 snap-start animate-slide-in-right">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/remy_ceo.jpeg" 
                      alt="Rémy Meva'a"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Rémy Meva'a</h3>
                  <p className="text-gray-600">CEO</p>
                </div>
              </div>

              {/* DG */}
              <div className="flex-none w-72 snap-start animate-slide-in-right [animation-delay:200ms]">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/dany_dg.jpeg" 
                      alt="Danielle ETONDE"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Danielle ETONDE</h3>
                  <p className="text-gray-600">Directrice Générale</p>
                </div>
              </div>

              {/* SG */}
              <div className="flex-none w-72 snap-start animate-slide-in-right [animation-delay:400ms]">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/jarida_sg.jpeg" 
                      alt="NGOUTANE Jarida"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">NGOUTANE Jarida</h3>
                  <p className="text-gray-600">SECRETAIRE GENERALE</p>
                </div>
              </div>

              {/* Redactrice */}
              <div className="flex-none w-72 snap-start animate-slide-in-right [animation-delay:600ms]">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/marie_redactrice.jpeg" 
                      alt="KELAH Marie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">KELAH Marie</h3>
                  <p className="text-gray-600">REDACTRICE</p>
                </div>
              </div>

              {/* Communicatrice 1 */}
              <div className="flex-none w-72 snap-start animate-slide-in-right [animation-delay:800ms]">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/michel_communicatrice.jpeg" 
                      alt="DEUMANI Michelle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">DEUMANI Michelle</h3>
                  <p className="text-gray-600">COMMUNICATRICE</p>
                </div>
              </div>

              {/* Communicatrice 2 */}
              <div className="flex-none w-72 snap-start animate-slide-in-right [animation-delay:1000ms]">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/aicha_communication.jpeg" 
                      alt="AICHATOU DJOUMAI"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AICHATOU DJOUMAI</h3>
                  <p className="text-gray-600">COMMUNICATRICE</p>
                </div>
              </div>

              {/* Communicateur */}
              <div className="flex-none w-72 snap-start animate-slide-in-right [animation-delay:1200ms]">
                <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                  <div className="w-48 h-48 mb-4 overflow-hidden rounded-full">
                    <img 
                      src="/yan_communication.jpeg" 
                      alt="YAN YOLI YOLI"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">YAN YOLI YOLI</h3>
                  <p className="text-gray-600">COMMUNICATEUR</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
