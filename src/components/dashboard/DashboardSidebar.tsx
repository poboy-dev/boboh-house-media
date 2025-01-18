import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserRound } from "lucide-react";

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
        .single();

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
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full hover:opacity-80 transition-opacity">
              <Avatar>
                <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  <UserRound className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    <UserRound className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold">
                    {session?.user?.email}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Role: {profile?.role || "User"}
                  </p>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
};