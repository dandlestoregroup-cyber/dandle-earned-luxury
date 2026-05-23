// NourChatWidget — non-invasive floating chat surface for the existing
// ecommerce site. Mounts globally; does not change any page or route.
// Opens a side drawer with Nour's S005 recommendation flow:
//   text/photo → server-side recommendation → recommendation card →
//   optional placement preview → confirm sheet → Add to Cart / Pay Securely.
//
// All AI calls go through Supabase edge functions (nour-recommend, nour-chat);
// no model is called from the browser, no API keys are exposed.

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Image as ImageIcon, MessageCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useShopifyCartStore, type ShopifyProduct } from "@/stores/shopifyCartStore";
import {
  getNourProduct,
  resolveMechanism,
  isMassageAddOnAllowed,
  type Mechanism,
} from "@/lib/nourCatalog";
import { buildNourProductForCart } from "@/lib/nourCartBridge";
import RecommendationCard, { type RecommendationRec } from "@/components/nour/RecommendationCard";
import ConfirmSheet from "@/components/nour/ConfirmSheet";
import RoomPreview from "@/components/nour/RoomPreview";

const WHATSAPP_NUMBER = "201222804255";

type ChatMessage =
  | { role: "user" | "assistant"; kind: "text"; content: string }
  | { role: "user"; kind: "image"; content: string }
  | { role: "assistant"; kind: "status"; content: string }
  | { role: "assistant"; kind: "recommendation"; top: RecommendationRec; alternatives: RecommendationRec[] }
  | { role: "assistant"; kind: "preview"; productId: string; mechanism: Mechanism; roomImage: string; renderedImage?: string; isRendering: boolean }
  | { role: "assistant"; kind: "confirm"; productId: string; mechanism: Mechanism };

const STRINGS = {
  en: {
    bubble: "Ask Nour",
    title: "Nour — Comfort Stylist",
    subtitle: "Share a room photo or describe your space.",
    greeting: "Hi! I'm Nour 👋",
    intro: "Tell me about your room or share a photo, and I'll suggest a Dandle recliner that fits. You can keep browsing the site at any time.",
    placeholder: "Describe your room or ask a question…",
    upload: "Attach a room photo",
    readingRoom: "Nour is reading your room…",
    readingDetails: "Looking at style, color, and space.",
    findingFit: "Finding the safest product fit…",
    recIntro: "Here's my best recommendation for your room.",
    failed: "Nour couldn't read this room clearly. You can try another photo or continue browsing normally.",
    cartAdded: "Added to your cart.",
    checkoutPrep: "Preparing your secure checkout…",
    checkoutUnavailable: "Secure checkout isn't available right now. We've added the item to your cart so you can finish from the cart page.",
    seeInRoomPrompt: "Want to see it in your room? Share a photo of where you'd like it. You can also confirm without a photo.",
    selectionConfirmed: "Review your choice and confirm.",
    nudgeAlts: "Pick one of the alternatives below, or keep browsing.",
    photoAttached: "Room photo attached",
    keepBrowsing: "Keep browsing",
  },
  ar: {
    bubble: "اسأل نور",
    title: "نور — مصممة الراحة",
    subtitle: "ابعت/ي صورة الأوضة أو وصفها.",
    greeting: "أهلاً! أنا نور 👋",
    intro: "احكي لي عن أوضتك أو ابعت/ي صورة، وأنا هرشح لك كرسي دانديل المناسب. تقدر/تقدري تكمل/ي تصفح الموقع في أي وقت.",
    placeholder: "اوصف/ي أوضتك أو اسأل/ي سؤال…",
    upload: "إرفاق صورة الأوضة",
    readingRoom: "نور بتقرأ أوضتك…",
    readingDetails: "بشوف الستايل واللون والمساحة.",
    findingFit: "بدور على أنسب اختيار…",
    recIntro: "ده أنسب اقتراح لأوضتك.",
    failed: "نور مش قادرة تقرأ الأوضة بوضوح من الصورة دي. جرب صورة أوضح أو كمل تصفح عادي.",
    cartAdded: "تمت إضافة المنتج لسلتك.",
    checkoutPrep: "بنجهز عملية الدفع الآمنة…",
    checkoutUnavailable: "الدفع المباشر مش متاح حالياً. ضفنا المنتج لسلتك عشان تكمل/ي من صفحة السلة.",
    seeInRoomPrompt: "حابب/حابة تشوفه في أوضتك؟ ابعت/ي صورة. ممكن كمان تأكد/ي بدون صورة.",
    selectionConfirmed: "راجع/ي اختيارك واعتمده.",
    nudgeAlts: "اختر/اختاري من الاختيارات تحت أو كمل/ي تصفح.",
    photoAttached: "صورة الأوضة جاهزة",
    keepBrowsing: "كمل تصفح",
  },
};

function getLanguage(): "en" | "ar" {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
}

function buildPlacementPrompt(productName: string) {
  return `Generate an edited image showing approximate placement of the ${productName} recliner in this room. Use realistic scale and natural lighting. Output an image only, no text.`;
}

interface Props {
  /** Optional default-locked product id (e.g. when opened from a PDP). */
  lockedProductId?: string;
  /** Initial language override; if omitted, follows <html lang>. */
  language?: "en" | "ar";
  /** Controlled open state (optional). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Hide the floating bubble (use when only externally controlled). */
  hideBubble?: boolean;
  /** Hide on these exact route prefixes (e.g. ["/cart", "/order/"]). */
  hideOnRoutes?: string[];
}

const NourChatWidget = ({
  lockedProductId,
  language: languageProp,
  open: openProp,
  onOpenChange,
  hideBubble = false,
  hideOnRoutes = [],
}: Props) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const open = isControlled ? !!openProp : internalOpen;
  const setOpen = (v: boolean) => {
    if (!isControlled) setInternalOpen(v);
    onOpenChange?.(v);
  };

  const location = useLocation();
  const onHiddenRoute = hideOnRoutes.some((r) => location.pathname.startsWith(r));

  const [language, setLanguage] = useState<"en" | "ar">(languageProp ?? getLanguage());
  useEffect(() => {
    if (languageProp) {
      setLanguage(languageProp);
      return;
    }
    const observer = new MutationObserver(() => setLanguage(getLanguage()));
    if (typeof document !== "undefined") {
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
    return () => observer.disconnect();
  }, [languageProp]);

  const t = STRINGS[language];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const shopifyCart = useShopifyCartStore();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  // When opened with a lockedProduct, kick off a recommendation once.
  const kickedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!open) return;
    if (lockedProductId && getNourProduct(lockedProductId) && kickedFor.current !== lockedProductId) {
      kickedFor.current = lockedProductId;
      void requestRecommendation({ lockedProductId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lockedProductId]);

  const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const authHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SUPA_KEY}`,
  };

  const pushMessage = (m: ChatMessage) => setMessages((p) => [...p, m]);

  const requestRecommendation = async (args: { description?: string; lockedProductId?: string; image?: string }) => {
    setIsBusy(true);
    pushMessage({ role: "assistant", kind: "status", content: t.readingRoom });
    pushMessage({ role: "assistant", kind: "status", content: t.readingDetails });
    pushMessage({ role: "assistant", kind: "status", content: t.findingFit });
    try {
      const resp = await fetch(`${FUNCTIONS_BASE}/nour-recommend`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          language,
          roomImage: args.image,
          roomDescription: args.description,
          lockedProductId: args.lockedProductId,
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      if (!data?.recommendations?.length) {
        pushMessage({ role: "assistant", kind: "text", content: t.failed });
        return;
      }
      const [top, ...alts] = data.recommendations as RecommendationRec[];
      pushMessage({ role: "assistant", kind: "text", content: t.recIntro });
      pushMessage({ role: "assistant", kind: "recommendation", top, alternatives: alts });
    } catch (err) {
      console.error("nour-recommend failed:", err);
      pushMessage({ role: "assistant", kind: "text", content: t.failed });
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendText = async () => {
    if (!input.trim() || isBusy) return;
    const userText = input.trim();
    setInput("");
    pushMessage({ role: "user", kind: "text", content: userText });

    if (roomImage) {
      const img = roomImage;
      setRoomImage(null);
      await requestRecommendation({ description: userText, image: img, lockedProductId });
      return;
    }

    if (/room|space|small|big|sofa|tv|living|أوض|مكان|صالة/i.test(userText)) {
      await requestRecommendation({ description: userText, lockedProductId });
      return;
    }

    setIsBusy(true);
    try {
      const resp = await fetch(`${FUNCTIONS_BASE}/nour-chat`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ messages: [{ role: "user", content: userText }] }),
      });
      if (!resp.ok) {
        if (resp.status === 429 || resp.status === 402) {
          toast({
            title: language === "ar" ? "خطأ" : "Error",
            description: language === "ar" ? "حاول مرة تانية بعد شوية." : "Please try again shortly.",
            variant: "destructive",
          });
        }
        throw new Error(`HTTP ${resp.status}`);
      }
      const data = await resp.json();
      if (data?.content) {
        pushMessage({ role: "assistant", kind: "text", content: String(data.content) });
      }
    } catch (e) {
      console.error("nour-chat error:", e);
    } finally {
      setIsBusy(false);
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setRoomImage(dataUrl);
      pushMessage({ role: "user", kind: "image", content: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleViewProduct = (rec: RecommendationRec) => {
    setOpen(false);
    navigate(`/products/${rec.product_id}`);
  };

  const handleSeeInRoom = async (rec: RecommendationRec) => {
    if (!roomImage) {
      pushMessage({ role: "assistant", kind: "text", content: t.seeInRoomPrompt });
      pushMessage({ role: "assistant", kind: "confirm", productId: rec.product_id, mechanism: rec.default_mechanism });
      return;
    }
    const previewIdx = messages.length;
    pushMessage({
      role: "assistant",
      kind: "preview",
      productId: rec.product_id,
      mechanism: rec.default_mechanism,
      roomImage,
      isRendering: true,
    });

    try {
      const product = getNourProduct(rec.product_id);
      if (!product) return;
      const resp = await fetch(`${FUNCTIONS_BASE}/nour-chat`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          type: "image",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: buildPlacementPrompt(product.name) },
                { type: "image_url", image_url: { url: roomImage } },
              ],
            },
          ],
        }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.type === "image" && typeof data.content === "string") {
          setMessages((prev) => prev.map((m, i) =>
            i === previewIdx && m.kind === "preview"
              ? { ...m, isRendering: false, renderedImage: data.content }
              : m,
          ));
          return;
        }
      }
    } catch (e) {
      console.warn("Placement preview generation failed; keeping overlay:", e);
    }
    setMessages((prev) => prev.map((m, i) =>
      i === previewIdx && m.kind === "preview" ? { ...m, isRendering: false } : m,
    ));
  };

  const handleShowOthers = () => {
    pushMessage({ role: "assistant", kind: "text", content: t.nudgeAlts });
  };

  const handleKeepBrowsing = () => {
    setOpen(false);
  };

  const handleSelectAlternative = (alt: RecommendationRec) => {
    pushMessage({ role: "user", kind: "text", content: alt.product_name });
    pushMessage({ role: "assistant", kind: "confirm", productId: alt.product_id, mechanism: alt.default_mechanism });
  };

  const goToConfirm = (productId: string, mechanism: Mechanism) => {
    pushMessage({ role: "assistant", kind: "text", content: t.selectionConfirmed });
    pushMessage({ role: "assistant", kind: "confirm", productId, mechanism });
  };

  const addSelectionToCart = (sel: { productId: string; mechanism: Mechanism; massage: boolean }) => {
    const product = buildNourProductForCart(sel.productId);
    if (!product) {
      toast({ title: "Error", description: "Product not found", variant: "destructive" });
      return false;
    }
    const approved = getNourProduct(sel.productId)!;
    const allowMassage = sel.massage && isMassageAddOnAllowed(approved);
    addItem(product, "As Shown", sel.mechanism, allowMassage);
    return true;
  };

  const handleAddToCart = (sel: { productId: string; mechanism: Mechanism; massage: boolean; price: number }) => {
    if (addSelectionToCart(sel)) {
      pushMessage({ role: "assistant", kind: "text", content: t.cartAdded });
      toast({ title: t.cartAdded });
    }
  };

  const handleCheckout = async (sel: { productId: string; mechanism: Mechanism; massage: boolean; price: number }) => {
    if (!addSelectionToCart(sel)) return;
    pushMessage({ role: "assistant", kind: "status", content: t.checkoutPrep });
    try {
      const approved = getNourProduct(sel.productId);
      if (!approved) throw new Error("Missing approved product");
      const shopifyProduct: ShopifyProduct = {
        id: approved.id,
        title: approved.name,
        handle: approved.id,
        images: [{ url: approved.image, altText: approved.name }],
      };
      shopifyCart.addItem({
        product: shopifyProduct,
        variantId: `nour-${approved.id}-${sel.mechanism}${sel.massage ? "-massage" : ""}`,
        variantTitle: `${sel.mechanism}${sel.massage ? " + massage" : ""}`,
        price: { amount: String(sel.price), currencyCode: "EGP" },
        quantity: 1,
        selectedOptions: [
          { name: "Mechanism", value: sel.mechanism },
          ...(sel.massage ? [{ name: "Massage", value: "yes" }] : []),
        ],
      });
      const url = await shopifyCart.createCheckout();
      if (url) {
        window.location.href = url;
        return;
      }
      setOpen(false);
      navigate("/cart");
    } catch (e) {
      console.warn("Secure checkout unavailable, routing to cart:", e);
      pushMessage({ role: "assistant", kind: "text", content: t.checkoutUnavailable });
      setOpen(false);
      navigate("/cart");
    }
  };

  const handleAskWhatsapp = () => {
    const text = encodeURIComponent(
      language === "ar"
        ? "أهلاً، محتاج/ة مساعدة في اختيار كرسي دانديل."
        : "Hi, I'd like help choosing a Dandle recliner.",
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  // ---- Render ----
  if (onHiddenRoute) return null;

  return (
    <>
      {!hideBubble && !open && (
        <motion.button
          type="button"
          aria-label={t.bubble}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white bg-gradient-to-r from-dandle-orange to-pink-500"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">{t.bubble}</span>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-50"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              role="dialog"
              aria-label={t.title}
              className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-warm-white shadow-luxury flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <header className="p-4 border-b border-bronze/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-dandle-orange to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-headline text-base text-charcoal truncate">{t.title}</h2>
                  <p className="text-xs text-charcoal/60 truncate">{t.subtitle}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleKeepBrowsing}>
                  {t.keepBrowsing}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close">
                  <X className="w-4 h-4" />
                </Button>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8 space-y-3">
                    <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-dandle-orange to-pink-500 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-headline text-lg text-charcoal">{t.greeting}</h3>
                    <p className="text-sm text-charcoal/60 max-w-xs mx-auto">{t.intro}</p>
                  </div>
                )}

                {messages.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const align = isUser ? "justify-end" : "justify-start";
                  if (msg.kind === "text" || msg.kind === "status") {
                    return (
                      <div key={idx} className={`flex ${align}`}>
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 whitespace-pre-wrap text-sm ${
                            isUser
                              ? "bg-primary text-primary-foreground"
                              : msg.kind === "status"
                                ? "bg-warm-beige text-charcoal/70 italic"
                                : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  }
                  if (msg.kind === "image") {
                    return (
                      <div key={idx} className={`flex ${align}`}>
                        <img src={msg.content} alt="Room" className="max-w-[70%] rounded-lg shadow-md" />
                      </div>
                    );
                  }
                  if (msg.kind === "recommendation") {
                    return (
                      <div key={idx} className="flex justify-start">
                        <RecommendationCard
                          rec={msg.top}
                          alternatives={msg.alternatives}
                          language={language}
                          onViewProduct={handleViewProduct}
                          onSeeInRoom={handleSeeInRoom}
                          onShowOthers={handleShowOthers}
                          onContinueBrowsing={handleKeepBrowsing}
                          onSelectAlternative={handleSelectAlternative}
                        />
                      </div>
                    );
                  }
                  if (msg.kind === "preview") {
                    const product = getNourProduct(msg.productId);
                    if (!product) return null;
                    return (
                      <div key={idx} className="flex justify-start">
                        <RoomPreview
                          roomImage={msg.roomImage}
                          productImage={product.image}
                          productName={language === "ar" ? product.nameAr : product.name}
                          language={language}
                          isRendering={msg.isRendering}
                          renderedImage={msg.renderedImage}
                          onAddToCart={() => goToConfirm(msg.productId, msg.mechanism)}
                          onPayNow={() => goToConfirm(msg.productId, msg.mechanism)}
                          onChangeProduct={handleKeepBrowsing}
                          onContinueBrowsing={handleKeepBrowsing}
                        />
                      </div>
                    );
                  }
                  if (msg.kind === "confirm") {
                    const approved = getNourProduct(msg.productId);
                    if (!approved) return null;
                    return (
                      <div key={idx} className="flex justify-start">
                        <ConfirmSheet
                          productId={msg.productId}
                          initialMechanism={resolveMechanism(approved, msg.mechanism)}
                          language={language}
                          onAddToCart={handleAddToCart}
                          onCheckout={handleCheckout}
                          onChangeProduct={handleKeepBrowsing}
                          onContinueBrowsing={handleKeepBrowsing}
                          onAskWhatsapp={handleAskWhatsapp}
                        />
                      </div>
                    );
                  }
                  return null;
                })}

                {isBusy && (
                  <div className="flex justify-start">
                    <div className="bg-accent text-accent-foreground rounded-2xl px-3 py-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {roomImage && (
                <div className="px-4 pt-2">
                  <div className="inline-flex items-center gap-2 bg-warm-beige rounded-lg px-2 py-1 text-xs text-charcoal/70">
                    <ImageIcon className="w-3 h-3" />
                    {t.photoAttached}
                    <button
                      type="button"
                      onClick={() => setRoomImage(null)}
                      className="text-charcoal/50 hover:text-charcoal"
                      aria-label="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 border-t border-border bg-warm-white">
                <div className="flex gap-2 items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isBusy}
                    title={t.upload}
                    className="border-bronze/30"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendText();
                      }
                    }}
                    placeholder={t.placeholder}
                    disabled={isBusy}
                    className="flex-1 bg-white border-bronze/20 focus:border-dandle-orange"
                  />
                  <Button
                    onClick={handleSendText}
                    disabled={isBusy || (!input.trim() && !roomImage)}
                    size="icon"
                    className="bg-gradient-to-r from-dandle-orange to-pink-500 hover:from-dandle-orange/90 hover:to-pink-500/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <button
                  type="button"
                  onClick={handleAskWhatsapp}
                  className="w-full text-center text-xs text-charcoal/60 hover:text-dandle-orange flex items-center justify-center gap-1 pt-2"
                >
                  <MessageCircle className="w-3 h-3" />
                  {language === "ar" ? "اسأل على واتساب" : "Ask on WhatsApp"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NourChatWidget;
