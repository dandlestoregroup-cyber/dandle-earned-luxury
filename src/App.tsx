import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
import AppInstallPrompt from "@/components/AppInstallPrompt";
import AppBottomNav from "@/components/AppBottomNav";
import AppHome from "./pages/AppHome";
import AppShop from "./pages/AppShop";
import AppCompare from "./pages/AppCompare";
import Index from "./pages/Index";
import Cart from "./pages/Cart";
import NourChat from "./pages/NourChat";
import NorthCoast from "./pages/NorthCoast";
import CompleteSet from "./pages/CompleteSet";
import ProductDetail from "./pages/ProductDetail";
import OrderStatus from "./pages/OrderStatus";
import NotFound from "./pages/NotFound";
import About from "./pages/trust/About";
import Warranty from "./pages/trust/Warranty";
import Delivery from "./pages/trust/Delivery";
import FAQ from "./pages/trust/FAQ";
import Payment from "./pages/trust/Payment";
import Installation from "./pages/trust/Installation";
import Returns from "./pages/trust/Returns";
import Contact from "./pages/trust/Contact";
import BackOfficeHub from "./pages/BackOfficeHub";

const queryClient = new QueryClient();

const ProductRedirect = () => {
  const { handle } = useParams();
  return <Navigate to={`/products/${handle}`} replace />;
};

const LanguageDirectionHandler = () => {
  useEffect(() => {
    const updateDirection = () => {
      const lang = document.documentElement.lang || "en";
      if (lang === "ar") {
        document.documentElement.setAttribute("dir", "rtl");
        document.documentElement.setAttribute("lang", "ar");
      } else {
        document.documentElement.setAttribute("dir", "ltr");
        document.documentElement.setAttribute("lang", "en");
      }
    };
    updateDirection();
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "lang") updateDirection();
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageDirectionHandler />
          <Routes>
            <Route path="/" element={<AppHome />} />
            <Route path="/shop" element={<AppShop />} />
            <Route path="/compare" element={<AppCompare />} />
            <Route path="/website" element={<Index />} />
            <Route path="/north-coast" element={<NorthCoast />} />
            <Route path="/product/:handle" element={<ProductRedirect />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/nour-chat" element={<NourChat />} />
            <Route path="/complete-set" element={<CompleteSet />} />
            <Route path="/products/:handle" element={<ProductDetail />} />
            <Route path="/order/:reference" element={<OrderStatus />} />
            <Route path="/backoffice" element={<BackOfficeHub />} />
            <Route path="/about" element={<About />} />
            <Route path="/warranty" element={<Warranty />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AppInstallPrompt />
          <AppBottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
