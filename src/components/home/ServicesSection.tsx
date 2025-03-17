
import React from "react";

export const ServicesSection: React.FC = () => {
  return (
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
  );
};
