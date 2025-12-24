import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cart from "./pages/Cart";
import NourChat from "./pages/NourChat";
import CompleteSet from "./pages/CompleteSet";
import ProductDetail from "./pages/ProductDetail";
import OrderStatus from "./pages/OrderStatus";
import GenerateImages from "./pages/admin/GenerateImages";
import GenerateHeroAssets from "./pages/admin/GenerateHeroAssets";
import AdminLayout from "./components/AdminLayout";
import About from "./pages/trust/About";
import Warranty from "./pages/trust/Warranty";
import Delivery from "./pages/trust/Delivery";
import FAQ from "./pages/trust/FAQ";
import Payment from "./pages/trust/Payment";
import Installation from "./pages/trust/Installation";
import Returns from "./pages/trust/Returns";
import Contact from "./pages/trust/Contact";
import Careers from "./pages/Careers";
import OurStory from "./pages/OurStory";

const queryClient = new QueryClient();

const App = () => (
  <CartProvider>
    <QueryClientProvider client={queryClient}>
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
            <Route path="/admin/generate-images" element={<AdminLayout><GenerateImages /></AdminLayout>} />
            <Route path="/admin/generate-hero" element={<AdminLayout><GenerateHeroAssets /></AdminLayout>} />
            <Route path="/about" element={<About />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/our-story" element={<OurStory />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </CartProvider>
);

export default App;
