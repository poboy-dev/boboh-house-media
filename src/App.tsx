
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "@/pages/Dashboard";
import UserManagement from "@/pages/UserManagement";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import BobohGeek from "@/pages/BobohGeek";
import BHAssociation from "@/pages/BHAssociation";
import NotFound from "@/pages/NotFound";
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ArticleDetail } from "@/components/ArticleDetail";
import { useSession, useSupabaseClient, SessionContextProvider } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CategoryArticles from "@/pages/CategoryArticles";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const supabaseClient = useSupabaseClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabaseClient.auth.getSession();
      console.log("Current session in ProtectedRoute:", currentSession);
      setIsLoading(false);
    };

    checkSession();
  }, [supabaseClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    console.log("No session in ProtectedRoute, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  console.log("Session found in ProtectedRoute, rendering children");
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionContextProvider supabaseClient={supabase}>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route
                    path="/dashboard/*"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="articles" element={<ArticlesTable />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="about" element={<About />} />
                  </Route>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/bobohgeek" element={<BobohGeek />} />
                  <Route path="/bh-association" element={<BHAssociation />} />
                  <Route path="/articles/:id" element={<ArticleDetail />} />
                  <Route path="/category/:slug" element={<CategoryArticles />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
          <Toaster />
        </SessionContextProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
