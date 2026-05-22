
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserTable } from "@/components/users/UserTable";
import { UserForm } from "@/components/users/UserForm";
import { UserRole } from "@/types/user";
import type { UserWithEmail } from "@/types/user";

export const UserManagement = () => {
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        // Call the SECURITY DEFINER RPC that joins auth.users to expose emails to admins
        const { data, error: rpcError } = await supabase.rpc("get_users_with_emails");

        if (rpcError) {
          console.error("Error calling get_users_with_emails RPC:", rpcError);
          throw rpcError;
        }

        console.log("Users with emails:", data);
        return (data ?? []) as unknown as UserWithEmail[];
      } catch (error) {
        console.error("Error in queryFn:", error);
        throw error;
      }
    },
  });

  const handleCreateUser = async (email: string, password: string, role: UserRole) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ email, password, role }),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Erreur lors de la création de l'utilisateur");

      toast.success("Utilisateur créé avec succès");
      refetch();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Erreur : " + (error as Error).message);
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
