
export type UserRole = "user" | "author" | "admin";

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserWithEmail extends Profile {
  email: string;
}

export interface AuthUser {
  id: string;
  email?: string;
}
