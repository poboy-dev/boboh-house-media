
import React from "react";
import { TeamMember } from "@/types/team";
import { supabase } from "@/integrations/supabase/client";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index }) => {
  let imageUrl = "/placeholder.svg";
  
  if (member.image) {
    // Handle both direct URLs and storage references
    if (member.image.startsWith('http')) {
      imageUrl = member.image;
    } else {
      // Check if the path starts with a slash and remove it if needed
      const imagePath = member.image.startsWith('/') ? member.image.substring(1) : member.image;
      const { data } = supabase.storage
        .from('team_images')
        .getPublicUrl(imagePath);
      
      if (data && data.publicUrl) {
        imageUrl = data.publicUrl;
        console.log('Generated image URL:', imageUrl);
      }
    }
  }

  return (
    <div 
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
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
        <p className="text-gray-600">{member.role}</p>
      </div>
    </div>
  );
};
