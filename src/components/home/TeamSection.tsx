
import React from "react";
import { TeamMember } from "@/types/team";
import { TeamMemberCard } from "./TeamMemberCard";

interface TeamSectionProps {
  teamMembers: TeamMember[] | undefined;
  isLoading: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ 
  teamMembers, 
  isLoading 
}) => {
  return (
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
              teamMembers?.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} index={index} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
