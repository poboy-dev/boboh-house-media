import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const DashboardSidebar = () => {
  const session = useSession();

  const { data: profile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      console.log("Fetching user profile...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
      console.log("Profile fetched:", data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return (
    <aside className="w-64 bg-secondary min-h-screen p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Dashboard</h2>
      </div>
    </aside>
  );
};