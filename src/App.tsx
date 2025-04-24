
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AnimatePresence } from "framer-motion";
import AnimatedLayout from "@/components/AnimatedLayout";

// Pages
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Results from "./pages/Results";
import History from "./pages/History";
import About from "./pages/About";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";

// Initialize the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const [detectionResults, setDetectionResults] = useState(null);
  
  useEffect(() => {
    // Check if there's a result stored from history view
    const savedResult = localStorage.getItem('current_result');
    if (savedResult) {
      setDetectionResults(JSON.parse(savedResult));
      localStorage.removeItem('current_result'); // Clear it after loading
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AnimatePresence mode="wait">
              <AnimatedLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route 
                    path="/upload" 
                    element={<Upload setResults={setDetectionResults} />} 
                  />
                  <Route 
                    path="/results" 
                    element={<Results results={detectionResults} />} 
                  />
                  <Route 
                    path="/history" 
                    element={<History />} 
                  />
                  <Route 
                    path="/about" 
                    element={<About />} 
                  />
                  <Route 
                    path="/feedback" 
                    element={<Feedback />} 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatedLayout>
            </AnimatePresence>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
