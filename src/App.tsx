import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/contexts/CartContext";
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

/**
 * React Router does not scroll on navigation, so in-page anchors such as
 * "/north-coast#find" changed the URL and left the visitor where they stood.
 * This restores both halves of the expected behaviour: jump to the anchor when
 * the location carries a hash, otherwise start the new page at the top.
 */
const ScrollManager = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0 });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;

    let frame = 0;
    let attempts = 0;

    // The target section can mount a few frames after the route change.
    const scrollToTarget = () => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (attempts++ < 60) frame = requestAnimationFrame(scrollToTarget);
    };

    frame = requestAnimationFrame(scrollToTarget);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
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
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Index />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
