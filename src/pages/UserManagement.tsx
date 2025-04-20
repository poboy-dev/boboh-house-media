
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { UserRole } from "@/types/user";

export const UserManagement = () => {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      // Fetch profiles data from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      // Fetch users data from auth.users using getUser for each profile
      // This approach avoids using admin.listUsers which may require special permissions
      if (!profiles || profiles.length === 0) return [];

      const usersWithEmails = await Promise.all(
        profiles.map(async (profile) => {
          // Get individual user data
          const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
          
          let email = 'Email non disponible';
          if (!userError && userData?.user) {
            email = userData.user.email || 'Email non disponible';
          }
          
          return {
            ...profile,
            email
          };
        })
      );

      return usersWithEmails;
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
