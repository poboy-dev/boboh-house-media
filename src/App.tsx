
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />}>
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
