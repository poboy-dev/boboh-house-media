
import React from "react";
import { TeamMember } from "@/types/team";
import { TeamMemberCard } from "./TeamMemberCard";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface TeamSectionProps {
  teamMembers: TeamMember[] | undefined;
  isLoading: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  isLoading
}) => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <Users className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">L'Équipe</span>
          </div>
          <h2 className="font-heading">Notre Équipe</h2>
          <div className="section-divider" />
        </motion.div>

        <div className="relative">
          {isLoading ? (
            <div className="w-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
              {teamMembers?.map((member, index) => (
                <TeamMemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          )}

          {/* Scroll fade indicators */}
          <div className="absolute top-0 bottom-8 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10 hidden md:block" />
          <div className="absolute top-0 bottom-8 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10 hidden md:block" />
        </div>
      </div>
    </section>
  );
};
