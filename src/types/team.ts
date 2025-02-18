
export type TeamRole = 'CEO' | 'DG' | 'SG' | 'REDACTRICE' | 'COMMUNICATRICE' | 'COMMUNICATEUR';

export type TeamMember = {
  id: string;
  name: string;
  role: TeamRole;
  image: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};
