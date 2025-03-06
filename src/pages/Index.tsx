import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { testTableAccess } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TeamMember } from "@/types/team";
import { Article } from "@/types/article";
import { ArrowRight } from "lucide-react";

const Index = () => {
  useEffect(() => {
    testTableAccess().then((result) => {
      console.log('Table access test results:', result);
    }).catch((error) => {
      console.error('Error testing table access:', error);
    });
  }, []);

  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order('order_index');
      
      if (error) {
        console.error("Error fetching team members:", error);
        throw error;
      }
      
      return data as TeamMember[];
    }
  });

  const { data: recentArticles, isLoading: isLoadingArticles } = useQuery({
    queryKey: ["recent-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error("Error fetching recent articles:", error);
        throw error;
      }
      
      return data as Article[];
    }
  });

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

      {/* Recent Articles Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Articles Récents</h2>
          {isLoadingArticles ? (
            <div className="w-full flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles?.map((article) => (
                <div key={article.id} className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(article.created_at).toLocaleDateString()}
                      </p>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {article.description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      {article.category && (
                        <Link 
                          to={`/${article.category}`} 
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          Plus d'articles {article.category}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                      <Link 
                        to={`/articles/${article.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Lire plus
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Notre Équipe</h2>
          <div className="relative">
            <div className="flex overflow-x-auto space-x-6 pb-8 snap-x snap-mandatory scrollbar-hide">
              {isLoading ? (
                <div className="w-full flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                teamMembers?.map((member, index) => {
                  const imageUrl = member.image?.startsWith('http') 
                    ? member.image 
                    : member.image 
                      ? supabase.storage.from('team_images').getPublicUrl(member.image).data.publicUrl 
                      : "/placeholder.svg";

                  return (
                    <div 
                      key={member.id} 
                      className="flex-none w-72 snap-start animate-slide-in-right"
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
                        <div className="w-48 h-48 mb-4 overflow-hidden rounded-full bg-gray-100">
                          <img 
                            src={imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              console.error('Team member image failed to load:', imageUrl);
                              const target = e.target as HTMLImageElement;
                              target.onerror = null; // Prevent infinite loop
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                        <p className="text-gray-600">{member.role}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
