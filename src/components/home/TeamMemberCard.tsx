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
    if (member.image.startsWith('http')) {
      imageUrl = member.image;
    } else {
      try {
        // 1. Clean the path (remove leading/trailing slashes and spaces)
        const cleanPath = member.image.trim().replace(/^\/+|\/+$/g, '');
        
        // 2. MANUALLY construct the URL to avoid double encoding
        const bucketUrl = supabase.storage.from('team_images').getPublicUrl('').data.publicUrl;
        imageUrl = `${bucketUrl}/${encodeURI(cleanPath)}?t=${Date.now()}`;
        
        console.log('Final image URL:', imageUrl); // Verify this looks correct
      } catch (error) {
        console.error('Error generating image URL:', error);
      }
    }
  }

  return (
    <div className="flex-none w-72 snap-start animate-slide-in-right" style={{ animationDelay: `${index * 200}ms` }}>
      {/* ... rest of your component ... */}
    </div>
  );
};