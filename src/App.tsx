
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Calendar from "./pages/Calendar";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Memories from "./pages/Memories";
import Settings from "./pages/Settings";
import TagMemories from "./pages/TagMemories";
import { MemoryProvider } from "./context/MemoryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MemoryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tag/:tag" element={<TagMemories />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </MemoryProvider>
  </QueryClientProvider>
);

export default App;
