
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
        const fileName = member.image.split('/').pop();

        if (fileName) {
          const { data } = supabase
            .storage
            .from('team_images')
            .getPublicUrl(fileName);

          if (data && data.publicUrl) {
            setImageUrl(data.publicUrl);
          } else {
            setImageUrl("/placeholder.svg");
          }
        } else {
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
      className="flex-none w-72 snap-start"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50 dark:border dark:border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
        {/* Image */}
        <div className="w-full h-72 overflow-hidden relative bg-gray-100 dark:bg-zinc-800">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={member.name}
            className={`w-full h-full object-cover transition-all duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} group-hover:scale-110`}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "/placeholder.svg";
            }}
            onLoad={() => setIsLoading(false)}
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Name overlay on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-white/90 text-sm">{member.role}</p>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 text-center">
          <h3 className="text-lg font-semibold font-heading text-neutral-900 dark:text-white">{member.name}</h3>
          <p className="text-muted-foreground dark:text-zinc-400 text-sm mt-1">{member.role}</p>
        </div>
      </div>
    </div>
  );
};
