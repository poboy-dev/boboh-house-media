
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
import { ArticlesTable } from "@/components/dashboard/ArticlesTable";
import { Footer } from "@/components/layout/Footer";
import { ArticleDetail } from "@/components/ArticleDetail";
import { useSession } from "@supabase/auth-helpers-react";

const queryClient = new QueryClient();

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    console.log("No session found, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route path="articles" element={<ArticlesTable />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            <Route path="/auth" element={<Auth />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bobohgeek" element={<BobohGeek />} />
            <Route path="/bh-association" element={<BHAssociation />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
