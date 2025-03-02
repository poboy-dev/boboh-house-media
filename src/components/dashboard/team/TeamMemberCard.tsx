
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash } from "lucide-react";
import { TeamMemberCardProps } from "./types";

export const TeamMemberCard = ({ member, onEdit, onDelete }: TeamMemberCardProps) => {
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
        
        <div className="aspect-square mb-4">
          <img
            src={member.image || "/placeholder.svg"}
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
        </div>
        
        <p className="text-sm text-muted-foreground">
          Ordre d'affichage: {member.order_index}
        </p>
      </div>
    </Card>
  );
};
