import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#9b87f5]/20 to-[#7E69AB]/20 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent mb-6 animate-fade-in">
              Boboh House Media
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto mb-8 animate-fade-in">
              Découvrez notre plateforme innovante pour partager et explorer du contenu passionnant.
              Rejoignez notre communauté grandissante dès aujourd'hui.
            </p>
            <div className="flex justify-center gap-4 animate-fade-in">
              <Button asChild size="lg" className="bg-[#9b87f5] hover:bg-[#7E69AB]">
                <Link to="/posts">Explorer les posts</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white">
                <Link to="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-[#6E59A5]">Nos Services</h2>
            <p className="text-foreground/80">Découvrez tout ce que nous avons à offrir</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:border-[#9b87f5] transition-colors">
              <h3 className="text-xl font-semibold mb-3 text-[#7E69AB]">Création de Contenu</h3>
              <p className="text-foreground/80">
                Partagez vos idées et vos histoires avec notre communauté.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:border-[#9b87f5] transition-colors">
              <h3 className="text-xl font-semibold mb-3 text-[#7E69AB]">Interaction</h3>
              <p className="text-foreground/80">
                Engagez-vous avec d'autres membres et échangez des idées.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border hover:border-[#9b87f5] transition-colors">
              <h3 className="text-xl font-semibold mb-3 text-[#7E69AB]">Support</h3>
              <p className="text-foreground/80">
                Une équipe dédiée pour vous aider à chaque étape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;