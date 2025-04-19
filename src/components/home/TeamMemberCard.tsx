import React from "react";
import { TeamMember } from "@/types/team";
import { supabase } from "@/integrations/supabase/client";

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index }) => {
  const [imageUrl, setImageUrl] = React.useState("/placeholder.svg");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
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
        // Clean the path (remove leading/trailing slashes and spaces)
        const cleanPath = member.image.trim().replace(/^\/+|\/+$/g, '');

        // First try: Use the exact path from database
        let publicUrl = await getPublicUrl(cleanPath);
        let imageExists = await checkImageExists(publicUrl);

        // Second try: Extract just the filename if path not found
        if (!imageExists) {
          const fileName = cleanPath.split('/').pop() || cleanPath;
          publicUrl = await getPublicUrl(fileName);
          imageExists = await checkImageExists(publicUrl);
        }

        // Third try: Search for similar filenames in storage
        if (!imageExists) {
          const similarUrl = await findSimilarImage(cleanPath);
          if (similarUrl) {
            publicUrl = similarUrl;
            imageExists = true;
          }
        }

        if (imageExists) {
          setImageUrl(publicUrl);
        } else {
          console.error('Image not found for:', cleanPath);
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

  // Helper function to get public URL from Supabase
  const getPublicUrl = async (path: string) => {
    const { data: { publicUrl } } = await supabase
      .storage
      .from('team_images')
      .getPublicUrl(path);
    return publicUrl;
  };

  // Helper function to check if image exists at URL
  const checkImageExists = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Helper function to find similar images in storage
  const findSimilarImage = async (originalPath: string) => {
    try {
      // Extract the base name without extension
      const baseName = originalPath.split('/').pop()?.split('.')[0] || '';
      
      // List files in the bucket
      const { data: files } = await supabase
        .storage
        .from('team_images')
        .list('', {
          limit: 100,
          sortBy: { column: 'name', order: 'asc' },
        });

      if (!files) return null;

      // Find a file that contains the original base name
      const matchingFile = files.find(file => 
        file.name.includes(baseName) || 
        baseName.includes(file.name.split('.')[0])
      );

      if (matchingFile) {
        const { data: { publicUrl } } = await supabase
          .storage
          .from('team_images')
          .getPublicUrl(matchingFile.name);
        return publicUrl;
      }
    } catch (error) {
      console.error('Error searching for similar image:', error);
    }
    return null;
  };

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
            className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
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