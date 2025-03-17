
import { useEffect } from "react";
import { testTableAccess } from "@/services/supabase";
import { useHomePageData } from "@/hooks/useHomePageData";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { RecentArticlesSection } from "@/components/home/RecentArticlesSection";
import { TeamSection } from "@/components/home/TeamSection";

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

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ServicesSection />
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
