import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import NourChat from "./pages/NourChat";
import CompleteSet from "./pages/CompleteSet";
import ProductDetail from "./pages/ProductDetail";
import OrderStatus from "./pages/OrderStatus";
import NotFound from "./pages/NotFound";
import GenerateImages from "./pages/admin/GenerateImages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/nour-chat" element={<NourChat />} />
            <Route path="/complete-set" element={<CompleteSet />} />
            <Route path="/products/:handle" element={<ProductDetail />} />
            <Route path="/order/:reference" element={<OrderStatus />} />
            <Route path="/admin/generate-images" element={<GenerateImages />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
