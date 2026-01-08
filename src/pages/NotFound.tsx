import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <main className="flex-1 flex items-center justify-center bg-background px-4 py-16 overflow-hidden">
      <div className="text-center max-w-md relative">
        {/* Decorative floating circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Animated icon */}
        <div className="mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4 animate-[bounce_3s_ease-in-out_infinite]">
            <SearchX className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* 404 with gradient and animation */}
        <h1 
          className="text-9xl font-black bg-gradient-to-br from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent mb-4 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          404
        </h1>
        
        <h2 
          className="text-2xl font-semibold text-foreground mb-4 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Page non trouvée
        </h2>
        
        <p 
          className="text-muted-foreground mb-8 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Button asChild className="hover-scale">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
