
import { TeamMember } from "@/types/team";

export interface TeamMemberFormProps {
  member?: TeamMember;
  onSave: (member: Partial<TeamMember>) => Promise<void>;
  onCancel: () => void;
  uploading?: boolean;
  onImageUpload: (file: File, memberId: string) => Promise<string>;
}

export interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onDelete: (id: string) => void;
}
