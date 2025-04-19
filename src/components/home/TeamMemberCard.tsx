
import React, { useState, useEffect } from "react";
import { TeamMember } from "@/types/team";
import { supabase } from "@/integrations/supabase/client";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index }) => {
  const [imageUrl, setImageUrl] = useState("/placeholder.svg");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImageUrl = async () => {
      if (!member.image) {
        setIsLoading(false);
        return;
      }

      // Handle external URLs directly
      if (member.image.startsWith('http')) {
        setImageUrl(member.image);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get the filename from the stored URL or path
        const fileName = member.image.split('/').pop();
        
        if (fileName) {
          // Get public URL directly using the filename
          const { data } = supabase
            .storage
            .from('team_images')
            .getPublicUrl(fileName);
            
          if (data && data.publicUrl) {
            setImageUrl(data.publicUrl);
          } else {
            console.error('Failed to get public URL for:', fileName);
            setImageUrl("/placeholder.svg");
          }
        } else {
          console.error('Invalid image path:', member.image);
          setImageUrl("/placeholder.svg");
        }
      } catch (error) {
        console.error('Error loading team member image:', error);
        setImageUrl("/placeholder.svg");
      } finally {
        setIsLoading(false);
      }
    };

    loadImageUrl();
  }, [member.image]);

  return (
    <div 
      className="flex-none w-72 snap-start animate-slide-in-right"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-2">
        <div className="w-48 h-48 mb-4 overflow-hidden rounded-full bg-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          <img 
            src={imageUrl}
            alt={member.name}
            className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            loading="lazy"
            onError={(e) => {
              console.error('Team member image failed to load:', imageUrl);
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
        <p className="text-gray-600">{member.role}</p>
      </div>
    </div>
  );
};
