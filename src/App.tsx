import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/layout/Navbar";
import Dashboard from "@/pages/Dashboard";
import NewArticle from "@/pages/NewArticle";
import EditArticle from "@/pages/EditArticle";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Portfolio from "@/pages/Portfolio";
import Contact from "@/pages/Contact";
import BobohGeek from "@/pages/BobohGeek";
import BHAssociation from "@/pages/BHAssociation";
import Auth from "@/pages/Auth";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/new-article" element={<NewArticle />} />
                <Route path="/edit-article/:id" element={<EditArticle />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/bobohgeek" element={<BobohGeek />} />
                <Route path="/bh-association" element={<BHAssociation />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </main>
          </div>
        </Router>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;