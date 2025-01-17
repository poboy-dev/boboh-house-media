import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "@/pages/Dashboard";
import NewArticle from "@/pages/NewArticle";
import EditArticle from "@/pages/EditArticle"; // Assuming you have an EditArticle component

const queryClient = new QueryClient();

function App() {
  return (
    <SessionProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-article" element={<NewArticle />} />
            <Route path="/edit-article/:id" element={<EditArticle />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default App;
