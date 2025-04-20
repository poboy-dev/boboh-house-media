
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { UserRole } from "@/types/user";
import type { Profile } from "@/types/user";

export const UserManagement = () => {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        // First, fetch user data from auth service
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error("Error fetching auth users:", authError);
          throw authError;
        }
        
        // Then fetch profiles from the profiles table
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("*");
        
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }
        
        // Explicit type assertion to avoid TypeScript error
        const typedProfiles = profiles as Profile[];
        
        // Combine profile data with auth user data
        const usersWithEmails = typedProfiles.map(profile => {
          const authUser = authUsers.find(user => user.id === profile.id);
          return {
            ...profile,
            email: authUser?.email || 'Email non disponible'
          };
        });
        
        console.log("Users with emails:", usersWithEmails);
        return usersWithEmails;
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
  });

  const handleCreateUser = async (email: string, password: string, role: UserRole) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ role })
          .eq("id", authData.user.id);

        if (profileError) throw profileError;
      }

      toast.success("Utilisateur créé avec succès");
      refetch();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Erreur lors de la création de l'utilisateur");
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      toast.success("Rôle mis à jour avec succès");
      refetch();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Erreur lors de la mise à jour du rôle");
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur lors du chargement des utilisateurs</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <UserForm onSubmit={handleCreateUser} />
      </div>
      <UserTable users={users || []} onRoleChange={handleRoleChange} />
    </div>
  );
};

export default UserManagement;
