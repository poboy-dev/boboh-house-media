import { useEffect } from "react";
import { testTableAccess } from "@/services/supabase";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RecentArticlesSection } from "@/components/home/RecentArticlesSection";
import { TeamSection } from "@/components/home/TeamSection";
import { usePopularArticles } from "@/hooks/usePopularArticles";
import { PopularArticlesSection } from "@/components/home/PopularArticlesSection";

const Index = () => {
  useEffect(() => {
    testTableAccess().then((result) => {
      console.log('Table access test results:', result);
    }).catch((error) => {
      console.error('Error testing table access:', error);
    });
  }, []);

  const {
    teamMembers,
    isLoadingTeam,
    recentArticles,
    isLoadingArticles
  } = useHomePageData();

  const { popularArticles, isLoadingPopular } = usePopularArticles(3);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
      <PopularArticlesSection
        articles={popularArticles}
        isLoading={isLoadingPopular}
      />
      <RecentArticlesSection 
        articles={recentArticles} 
        isLoading={isLoadingArticles} 
      />
      <TeamSection 
        teamMembers={teamMembers} 
        isLoading={isLoadingTeam} 
      />
    </div>
  );
};

export default Index;
