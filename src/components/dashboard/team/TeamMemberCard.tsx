
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { TeamMemberCardProps } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const TeamMemberCard = ({ member, onEdit, onDelete }: TeamMemberCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>("/placeholder.svg");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!member.image) {
        setImageUrl("/placeholder.svg");
        setImageLoading(false);
        return;
      }

      // Handle direct URLs
      if (member.image.startsWith('http')) {
        setImageUrl(member.image);
        setImageLoading(false);
        return;
      }

      try {
        // If the image is already a filename or path, extract just the filename
        const fileName = member.image.split('/').pop();
        
        if (fileName) {
          const { data } = supabase.storage
            .from('team_images')
            .getPublicUrl(fileName);
          
          if (data && data.publicUrl) {
            setImageUrl(data.publicUrl);
          }
        }
      } catch (error) {
        console.error('Error generating image URL:', error);
        setImageUrl("/placeholder.svg");
      } finally {
        setImageLoading(false);
      }
    };

    loadImage();
  }, [member.image]);

  return (
    <Card className="p-4">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(member)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(member.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="relative w-32 h-32 mx-auto mb-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={member.name}
            className={`w-full h-full object-cover rounded-full ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
            onLoad={() => setImageLoading(false)}
          />
        </div>
        
        <p className="text-sm text-muted-foreground text-center">
          Ordre d'affichage: {member.order_index}
        </p>
      </div>
    </Card>
  );
};
