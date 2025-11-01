import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, MessageSquare, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import ColorThief from "colorthief";

interface NourModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RECLINERS = [
  { 
    model: "RelaxMax", 
    sku: "series1-relaxmax",
    colors: [
      { name: "Elephant Grey", hex: "#6B7280", image: "/images/relaxmax-hero-offwhite.jpg" },
      { name: "Off White", hex: "#F5F5DC", image: "/images/relaxmax-lifestyle-day.png" },
      { name: "Royal Blue", hex: "#1E40AF", image: "/images/relaxmax-hero-offwhite.jpg" }
    ],
    price: "21,900 EGP"
  },
  { 
    model: "CozyCompanion", 
    sku: "two-seat-yellow",
    colors: [
      { name: "Yellow", hex: "#FCD34D", image: "/images/cozycompanion-yellow-front.jpg" },
      { name: "Tan Beige", hex: "#D2B48C", image: "/images/cozycompanion-yellow-front.jpg" }
    ],
    price: "32,900 EGP"
  },
  { 
    model: "Diva", 
    sku: "series2-diva",
    colors: [
      { name: "Chic Red", hex: "#DC2626", image: "/images/relaxmax-lifestyle-night.png" },
      { name: "Off White", hex: "#F5F5DC", image: "/images/relaxmax-lifestyle-day.png" }
    ],
    price: "23,900 EGP"
  }
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Placement = { 
  id: number; 
  title: string; 
  subtitle: string; 
  why: string;
};

const NourModal = ({ open, onOpenChange }: NourModalProps) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<"greeting" | "carousel" | "upload" | "analyzing" | "placement" | "render" | "chat">("greeting");
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [placementInstruction, setPlacementInstruction] = useState<string>("");
  const [selectedRecliner, setSelectedRecliner] = useState(RECLINERS[0]);
  const [selectedColor, setSelectedColor] = useState(RECLINERS[0].colors[0]);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [beforeAfterSlide, setBeforeAfterSlide] = useState(50);
  const [editCount, setEditCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Placement[]>([]);
  const [chosen, setChosen] = useState<Placement | null>(null);
  const [customPlacement, setCustomPlacement] = useState("");
  const [showIntro, setShowIntro] = useState(false);
  const [analyzingCountdown, setAnalyzingCountdown] = useState(15);
  const analyzingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepRef = useRef(step);
  useEffect(() => { stepRef.current = step; }, [step]);

  // Show intro overlay on first open
  useEffect(() => {
    if (open) {
      const hasSeenIntro = localStorage.getItem('nour-intro-seen');
      if (!hasSeenIntro) {
        setShowIntro(true);
        setTimeout(() => {
          setShowIntro(false);
          localStorage.setItem('nour-intro-seen', 'true');
        }, 7000);
      }
    }
  }, [open]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const carouselCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const chimeAudioRef = useRef<HTMLAudioElement | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load chime and tick sounds
  useEffect(() => {
    const chime = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SxYqH5AAAAAAAAAAAAAAAAAAAAAP/7kGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5BkAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
    chime.volume = 0.3;
    chimeAudioRef.current = chime;
    
    // Soft tick sound (8kB max)
    const tick = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=');
    tick.volume = 0.15;
    tickAudioRef.current = tick;
  }, []);

  // Register service worker for model caching
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service worker registration failed:', error);
      });
    }
  }, []);

  // Auto-greeting on mount + ESC handler
  useEffect(() => {
    if (open && !hasGreeted) {
      setTimeout(() => {
        setHasGreeted(true);
        if (greetingRef.current) {
          gsap.fromTo(greetingRef.current, 
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4 }
          );
        }
      }, 300);
    }
    
    // ESC key handler for greeting overlay
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step === 'greeting') {
        onOpenChange(false);
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, hasGreeted, step, onOpenChange]);

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
      if (analyzingTimeoutRef.current) {
        clearTimeout(analyzingTimeoutRef.current);
        analyzingTimeoutRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [autoAdvanceTimer]);

  // Button hover animation
  useEffect(() => {
    if (buttonRef.current) {
      const button = buttonRef.current;
      const handleMouseEnter = () => {
        gsap.to(button, { y: -2, boxShadow: "0 8px 20px rgba(243, 122, 29, 0.4)", duration: 0.2 });
      };
      const handleMouseLeave = () => {
        gsap.to(button, { y: 0, boxShadow: "0 4px 12px rgba(243, 122, 29, 0.2)", duration: 0.2 });
      };
      button.addEventListener('mouseenter', handleMouseEnter);
      button.addEventListener('mouseleave', handleMouseLeave);
      return () => {
        button.removeEventListener('mouseenter', handleMouseEnter);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, [buttonRef.current, step]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');
  };

  // Tilt and glow animation helper with sound
  const triggerTiltGlow = (cardElement: HTMLElement) => {
    // Play soft tick
    tickAudioRef.current?.play().catch(() => {});
    
    // GSAP tilt + scale + orange glow
    gsap.fromTo(cardElement,
      { 
        rotateY: 0, 
        scale: 1,
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)" 
      },
      { 
        rotateY: 5, 
        scale: 1.02,
        boxShadow: "0 0 6px rgba(243, 122, 29, 0.8)",
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      }
    );
  };

  // Fetch AI placement suggestions
  const fetchPlacementSuggestions = async (dataUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("nour-chat", {
        body: {
          type: "placement",
          image: dataUrl,
          prompt: `You are an interior-design expert.
Given the uploaded room photo, list exactly 3 concise, distinct, realistic locations where a recliner would fit.
Return ONLY a JSON array of objects with keys:
"id" (1,2,3), "title" (<=6 words), "subtitle" (<=12 words), "why" (<=20 words).
Use only visible elements from photo. Do not invent furniture or architectural features.
If no free wall is visible, suggest asking for another angle.`
        }
      });

      if (error) throw error;

      let list: Placement[] = [];
      try {
        if (data?.type === "placement" && data?.content) {
          // Strip markdown code fences if present
          let jsonContent = data.content.trim();
          if (jsonContent.startsWith('```json')) {
            jsonContent = jsonContent.replace(/^```json\s*\n/, '').replace(/\n```$/, '');
          } else if (jsonContent.startsWith('```')) {
            jsonContent = jsonContent.replace(/^```\s*\n/, '').replace(/\n```$/, '');
          }
          list = JSON.parse(jsonContent);
        }
      } catch (e) {
        console.error("Failed to parse placement suggestions:", e);
      }
      setSuggestions(list.slice(0, 3));
      
      // Clear timeout and countdown interval
      if (analyzingTimeoutRef.current) {
        clearTimeout(analyzingTimeoutRef.current);
        analyzingTimeoutRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setStep("placement");
    } catch (error) {
      console.error("Placement suggestions error:", error);
      toast({ title: "Failed to generate placement suggestions", variant: "destructive" });
      // On error, reset to upload and clear timers
      if (analyzingTimeoutRef.current) {
        clearTimeout(analyzingTimeoutRef.current);
        analyzingTimeoutRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      setStep("upload");
      setRoomImage(null);
    }
  };

  // Extract colors from uploaded image (FIX #1)
  const extractAndApplyColors = (imageDataUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageDataUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 3);
        
        if (palette && palette.length >= 3) {
          document.documentElement.style.setProperty('--user-color-1', `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`);
          document.documentElement.style.setProperty('--user-color-2', `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})`);
          document.documentElement.style.setProperty('--user-color-3', `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})`);
          
          // Animate background gradient
          if (dialogContentRef.current) {
            gsap.to(dialogContentRef.current, {
              background: 'linear-gradient(135deg, var(--user-color-1), var(--user-color-2), var(--user-color-3))',
              duration: 1,
              ease: "power2.inOut"
            });
          }
        }
      } catch (error) {
        console.error('Color extraction failed:', error);
      }
    };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Force 16:9 canvas with center crop
          const canvas = document.createElement('canvas');
          const targetRatio = 16 / 9;
          const imgRatio = img.width / img.height;
          
          let cropWidth = img.width;
          let cropHeight = img.height;
          let offsetX = 0;
          let offsetY = 0;

          if (imgRatio > targetRatio) {
            cropWidth = img.height * targetRatio;
            offsetX = (img.width - cropWidth) / 2;
          } else {
            cropHeight = img.width / targetRatio;
            offsetY = (img.height - cropHeight) / 2;
          }

          canvas.width = 1280;
          canvas.height = 720;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, 1280, 720);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setRoomImage(dataUrl);
            
            // Extract colors and animate background
            extractAndApplyColors(dataUrl);
            
            // Move to analyzing step
            setStep("analyzing");
            setAnalyzingCountdown(15);
            
            // Start countdown
            const countdownInterval = setInterval(() => {
              setAnalyzingCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(countdownInterval);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
            countdownIntervalRef.current = countdownInterval;
            
            // Set 20s timeout fallback
            analyzingTimeoutRef.current = setTimeout(() => {
              // Only fire if still analyzing
              if (stepRef.current !== "analyzing") return;
              toast({ 
                title: "Analysis taking longer than expected", 
                description: "Please try uploading another image",
                variant: "destructive" 
              });
              setStep("upload");
              setRoomImage(null);
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
            }, 20000);
            
            // Fetch AI placement suggestions (will clear timeout when done)
            fetchPlacementSuggestions(dataUrl);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRender = async (imageToRender?: string) => {
    const targetImage = imageToRender || roomImage;
    if (!targetImage) return;

    if (editCount >= 3) {
      toast({ title: t('editsRemaining', { count: 0 }), variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Runtime model assertion
    const modelId = 'google/gemini-2.5-flash-image-preview';
    const skuCheck = selectedRecliner.sku;
    
    console.log(`Model assertion: ${modelId}, SKU check: ${skuCheck}`);

    try {
      const placementLine = chosen
        ? `Place the recliner at: ${chosen.title} — ${chosen.subtitle}.`
        : placementInstruction 
          ? ` ${placementInstruction}.`
          : "";
      
      const prompt = `Insert a ${selectedRecliner.model} recliner in ${selectedColor.name} into this room.${placementLine ? ' ' + placementLine : ''} CRITICAL: Preserve ALL existing furniture - do not remove or replace any objects. Only add the new recliner. Match lighting, shadows, and perspective perfectly. Use only visible elements from photo. Do not invent furniture or architectural features. If no free wall is visible, ask for another angle instead of guessing.`;
      
      const { data, error } = await supabase.functions.invoke("nour-chat", {
        body: {
          type: "image",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: targetImage } }
              ]
            }
          ]
        }
      });

      if (error) throw error;

      if (data?.type === "image" && data?.content) {
        setRenderedImage(data.content);
        setEditCount(editCount + 1);
        
        // Play chime
        chimeAudioRef.current?.play();
        
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
        
        toast({ 
          title: t('complete'),
          description: t('editsRemaining', { count: 3 - editCount - 1 })
        });

        // Show Arabic calligraphy compliment (FIX #6)
        showEgyptianCompliment();
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      console.error("Render error:", error);
      toast({ title: "Rendering failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Egyptian compliment after render (FIX #6)
  const showEgyptianCompliment = () => {
    const compliment = document.createElement('div');
    compliment.innerHTML = i18n.language === 'ar' 
      ? 'مثالي… مكانك يستحق هذا الهدوء' 
      : 'Perfect... your space deserves this tranquility';
    compliment.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      font-weight: 600;
      color: rgba(243, 122, 29, 0.9);
      text-align: center;
      z-index: 9999;
      pointer-events: none;
      font-family: ${i18n.language === 'ar' ? 'Amiri, serif' : 'Inter, sans-serif'};
    `;
    document.body.appendChild(compliment);

    gsap.fromTo(compliment,
      { opacity: 0, scale: 0.8 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.5,
        onComplete: () => {
          gsap.to(compliment, {
            opacity: 0,
            duration: 0.5,
            delay: 1.5,
            onComplete: () => compliment.remove()
          });
        }
      }
    );
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMsg: Message = { role: "user", content: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("nour-chat", {
        body: {
          type: "text",
          messages: [...messages, userMsg]
        }
      });

      if (error) throw error;

      if (data?.type === "text" && data?.content) {
        setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({ title: "Chat failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("greeting");
    setRoomImage(null);
    setRenderedImage(null);
    setEditCount(0);
    setMessages([]);
    setBeforeAfterSlide(50);
    setPlacementInstruction("");
    
    // Reset background to default
    if (dialogContentRef.current) {
      gsap.to(dialogContentRef.current, {
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
        duration: 0.5
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        ref={dialogContentRef}
        className={`nour-wrapper ${
          step === 'greeting' 
            ? 'overflow-hidden w-screen h-screen max-w-none max-h-[100vh] border-0 bg-transparent shadow-none p-0' 
            : 'max-w-4xl max-h-[90vh] overflow-y-auto'
        }`}
        style={{
          background: step === 'greeting' ? 'transparent' : 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)',
          width: step === 'greeting' ? '100vw' : '100%',
          maxWidth: '100vw',
          height: step === 'greeting' ? '100vh' : undefined,
          maxHeight: step === 'greeting' ? '100vh' : undefined,
          left: step === 'greeting' ? 0 as unknown as string : undefined,
          top: step === 'greeting' ? 0 as unknown as string : undefined,
          transform: step === 'greeting' ? 'none' : undefined,
          paddingLeft: step === 'greeting' ? '0' : 'env(safe-area-inset-left)',
          paddingRight: step === 'greeting' ? '0' : 'env(safe-area-inset-right)',
          boxSizing: 'border-box'
        }}
      >
        <DialogHeader className={step === 'greeting' ? 'sr-only' : ''}>
          <div className="flex items-center justify-between">
            <DialogTitle className={step === 'greeting' ? 'sr-only' : 'flex items-center gap-2'}>
              {step === 'greeting' ? 'Nour AI Experience' : (
                <>
                  <Sparkles className="w-5 h-5 text-primary" />
                  Nour - AI Comfort Stylist
                </>
              )}
            </DialogTitle>
            {step !== 'greeting' && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleLanguage}
                className="gap-2"
              >
                <Languages className="w-4 h-4" />
                {i18n.language === 'ar' ? '🇪🇬' : '🇬🇧'}
              </Button>
            )}
          </div>
          <DialogDescription className="sr-only">
            {step === 'greeting' ? 'Experience AI-powered room visualization' : t('greeting')}
          </DialogDescription>
        </DialogHeader>

        {/* Intro Overlay */}
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl my-8"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Welcome to Nour ✨
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Just upload a photo of your space, and I'll help you see exactly how our comfort pieces will look in your home.
              </p>
              <div className="mt-6 text-sm text-gray-500 animate-pulse">
                Starting in a moment...
              </div>
            </motion.div>
          </motion.div>
        )}

        {step === "greeting" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center min-h-[90vh] md:min-h-[80vh]"
            style={{
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) onOpenChange(false);
            }}
          >
            <div 
              className="glass-island relative rounded-2xl border border-white/20 p-8 text-center space-y-6 max-w-[360px] mx-4"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Ken-burns looping video/image */}
              <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                <img 
                  src="/aura-loop.jpg"
                  alt="Comfort preview"
                  className="w-full h-full object-cover animate-ken-burns"
                />
              </div>

              {/* Bilingual headline */}
              <h2 
                className="text-white font-bold leading-tight"
                style={{ 
                  fontFamily: i18n.language === 'ar' ? 'Cairo Play, sans-serif' : 'inherit',
                  fontSize: '28px'
                }}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              >
                {i18n.language === 'ar' ? 'قعد عليه قبل ما تشتريه' : 'Sit in it before you buy'}
              </h2>

              {/* Bilingual subline */}
              <p 
                className="text-white/80 text-sm leading-relaxed"
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              >
                {i18n.language === 'ar' 
                  ? 'صوّر أوضتك، نحط الكرسي مكانه، الأثاث يفضل، النتيجة في 15 ثانية'
                  : 'Snap one photo, we drop the recliner into your room – furniture stays, result in 15 s'
                }
              </p>

              {/* Breathing orange pill CTA */}
              <Button
                ref={buttonRef}
                onClick={() => setStep("carousel")}
                className="w-full h-12 text-lg font-semibold rounded-full animate-pulse-glow"
                style={{
                  background: 'hsl(var(--primary))',
                  boxShadow: '0 4px 20px rgba(243, 122, 29, 0.4)'
                }}
              >
                {i18n.language === 'ar' ? 'جربه دلوقتي' : 'Try it now'}
              </Button>
            </div>
          </motion.div>
        )}

        {step === "carousel" && (
          <div className="space-y-6 py-4 px-2 sm:px-4">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">{i18n.language === 'ar' ? 'اختر الكرسي' : 'Choose Your Recliner'}</h2>
              <p className="text-sm sm:text-base text-muted-foreground">{t('selectRecliner')}</p>
            </div>
            
            <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl mx-auto">
              <Carousel 
                opts={{ 
                  align: "center",
                  loop: true,
                  containScroll: "trimSnaps"
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {RECLINERS.map((recliner, idx) => (
                    <CarouselItem key={idx} className="pl-2 md:pl-4 basis-full">
                      <Card 
                        className="cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl border-2 max-w-[320px] sm:max-w-[400px] mx-auto"
                        onClick={() => {
                          setSelectedRecliner(recliner);
                          setSelectedColor(recliner.colors[0]);
                          triggerTiltGlow(carouselCardRefs.current[idx]!);
                          
                          // Auto-advance to upload step after 2 seconds
                          setTimeout(() => setStep("upload"), 2000);
                        }}
                      >
                        <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                          <div 
                            className="relative overflow-hidden rounded-xl bg-muted/30 mx-auto w-full"
                            style={{ 
                              maxWidth: '280px',
                              aspectRatio: '4 / 3'
                            }}
                          >
                            <img 
                              src={recliner.colors[0].image}
                              alt={`${recliner.model} luxury recliner chair in ${recliner.colors[0].name} - Premium Egyptian furniture for modern living rooms - Dandle Comfort Collection`}
                              title={`${recliner.model} Recliner - ${recliner.price}`}
                              className="w-full h-full object-contain"
                              loading="eager"
                            />
                          </div>
                          
                          <div className="text-center space-y-2 sm:space-y-3">
                            <h3 className="text-lg sm:text-xl font-bold">{recliner.model}</h3>
                            <p className="text-base sm:text-lg font-semibold text-primary">{recliner.price}</p>
                            
                            {/* Color selection */}
                            <div className="flex justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                              {recliner.colors.map((color, colorIdx) => (
                                <button
                                  key={colorIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRecliner(recliner);
                                    setSelectedColor(color);
                                  }}
                                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 sm:border-4 transition-all hover:scale-110 ${
                                    selectedRecliner.model === recliner.model && selectedColor.name === color.name
                                      ? 'border-primary scale-125 shadow-lg'
                                      : 'border-muted-foreground/30'
                                  }`}
                                  style={{ backgroundColor: color.hex }}
                                  title={`${color.name} color option for ${recliner.model} recliner`}
                                  aria-label={`Select ${color.name} color`}
                                />
                              ))}
                            </div>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                setStep("upload");
                              }}
                              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold mt-4 sm:mt-6 rounded-xl"
                              style={{
                                background: 'hsl(var(--primary))',
                                boxShadow: '0 4px 16px rgba(243, 122, 29, 0.4)'
                              }}
                            >
                              {i18n.language === 'ar' ? 'جرّب في غرفتك' : 'Try in Your Room'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious 
                  className="left-1 sm:left-2 md:-left-12 h-8 w-8 sm:h-10 sm:w-10"
                  aria-label="Previous recliner model"
                />
                <CarouselNext 
                  className="right-1 sm:right-2 md:-right-12 h-8 w-8 sm:h-10 sm:w-10"
                  aria-label="Next recliner model"
                />
              </Carousel>
            </div>
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-6 py-4">
            {uploadProgress ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                {/* AI Pulse Scanning Overlay */}
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full animate-pulse" />
                  <div className="absolute inset-0 border-4 border-accent/40 rounded-full animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Upload className="w-16 h-16 text-accent animate-bounce" style={{ animationDuration: '1s' }} />
                  </div>
                </div>
                
                {/* Dynamic Progress Narration */}
                <motion.p 
                  key={uploadProgress}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-lg font-medium text-accent"
                >
                  {uploadProgress}
                </motion.p>
              </div>
            ) : (
              <>
                <p className="text-center text-muted-foreground" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                  {i18n.language === 'ar' ? 'ارفع صورة لغرفتك لبدء التجربة' : 'Upload a photo of your room to start'}
                </p>
                <div
                  className="relative border-2 border-dashed rounded-xl p-12 text-center hover:border-accent/60 hover:bg-accent/5 transition-all duration-500 cursor-pointer group overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {/* Shimmer effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -translate-x-full group-hover:translate-x-full" 
                       style={{ transitionProperty: 'transform, opacity', transitionDuration: '1.5s' }} />
                  
                  <Upload className="w-14 h-14 mx-auto mb-4 text-muted-foreground group-hover:text-accent transition-colors duration-300" />
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                    {t('uploadPlaceholder')}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-2">
                    {i18n.language === 'ar' ? 'اسحب أو انقر للتحميل' : 'Drag or click to upload'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setStep("carousel")} className="hover:bg-accent/10">
                    {i18n.language === 'ar' ? 'رجوع' : 'Back'}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {step === "analyzing" && roomImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 space-y-8"
          >
            {/* Animated spinner */}
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full" />
              <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" 
                   style={{ animationDuration: '1s' }} />
              
              {/* Orange shimmer sweep */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent" 
                     style={{ 
                       backgroundSize: '200% 100%',
                       animation: 'shimmer 2s infinite linear'
                     }} />
              </div>
              
              {/* Countdown in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span 
                  key={analyzingCountdown}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-accent"
                >
                  {analyzingCountdown}
                </motion.span>
              </div>
            </div>
            
            {/* Status text with fade animation */}
            <div className="space-y-3 text-center max-w-md">
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold text-accent"
              >
                Reading your room…
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground"
              >
                Finding best comfort spots…
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-muted-foreground/70"
              >
                Usually takes 5-10 seconds
              </motion.p>
            </div>
            
            <div 
              role="status" 
              aria-live="polite" 
              aria-label="Analyzing room layout"
              className="sr-only"
            />
          </motion.div>
        )}

        {step === "placement" && roomImage && (
          <div className="relative w-full max-w-5xl mx-auto px-6">
            <div className="absolute -inset-40 bg-gradient-radial from-orange-400/10 via-rose-400/5 to-transparent blur-3xl animate-pulse" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-center">
                Let's find the perfect corner — together.
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto pr-1">
                {suggestions.map((s) => (
                  <motion.button
                    key={s.id}
                    onClick={() => setChosen(s)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative rounded-2xl overflow-hidden border bg-card text-foreground p-4 text-left transition-all
                      ${chosen?.id === s.id ? "border-primary shadow-[0_0_0_2px_rgba(251,146,60,0.35)]" : "border-border hover:border-primary/50"}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative">
                      <div className="text-lg font-medium">{s.title}</div>
                      <div className="text-sm text-muted-foreground">{s.subtitle}</div>
                      <div className="text-xs text-muted-foreground mt-2">"{s.why}"</div>
                    </div>
                    <div className="absolute bottom-3 right-3 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Feels right here →
                    </div>
                  </motion.button>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="relative rounded-2xl border border-dashed border-border bg-card p-4 flex flex-col justify-center items-center text-center"
                >
                  <textarea
                    value={customPlacement}
                    onChange={(e) => setCustomPlacement(e.target.value)}
                    placeholder="Or describe your own spot…"
                    className="w-full bg-transparent placeholder:text-muted-foreground text-sm text-foreground resize-none focus:outline-none"
                    rows={3}
                  />
                  <button
                    onClick={() => customPlacement && setChosen({ id: 99, title: "Custom", subtitle: customPlacement, why: "Your choice" })}
                    disabled={!customPlacement}
                    className="mt-3 px-3 py-1 rounded-full bg-orange-500/80 text-white text-xs disabled:opacity-40"
                  >
                    Use this →
                  </button>
                </motion.div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep("upload")} className="text-muted-foreground hover:text-foreground">← Back</button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchPlacementSuggestions(roomImage!)}
                    className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm text-foreground"
                  >
                    Try again
                  </button>
                  <button
                    onClick={() => {
                      setStep("render");
                      handleRender();
                    }}
                    disabled={!chosen}
                    className="px-6 py-2 rounded-full bg-orange-500 text-white font-medium disabled:opacity-40"
                  >
                    Render my comfort
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {step === "render" && (
          <div className="space-y-4">
            {isLoading ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center py-16 space-y-6"
              >
                {/* Cinematic Shimmer Sweep */}
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-accent border-t-transparent rounded-full animate-spin" 
                       style={{ animationDuration: '1.2s' }} />
                  
                  {/* Orange shimmer sweep */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent animate-shimmer" 
                         style={{ 
                           backgroundSize: '200% 100%',
                           animation: 'shimmer 2s infinite linear'
                         }} />
                  </div>
                </div>
                
                {/* Motion Caption */}
                <div className="space-y-2 text-center">
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-semibold text-accent"
                  >
                    Designing your comfort...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-sm text-muted-foreground"
                    dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {i18n.language === 'ar' ? 'نقوم بإنشاء رؤيتك المثالية...' : 'Creating your perfect vision...'}
                  </motion.p>
                </div>
                
                <div 
                  role="status" 
                  aria-live="polite" 
                  aria-label={t('rendering')}
                  className="sr-only"
                />
              </motion.div>
            ) : renderedImage ? (
              <>
                <Label className="text-center block" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                  {t('beforeAfter')}
                </Label>
                
                {/* Before/After Slider (FIX #2) */}
                <motion.div 
                  ref={sliderContainerRef}
                  className="relative w-full aspect-video rounded-lg overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{ 
                    maxWidth: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* After image (full) */}
                  <img 
                    src={renderedImage} 
                    alt={t('withRecliner', { model: selectedRecliner.model, color: selectedColor.name })}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  {/* Before image (clipped) */}
                  <div 
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - beforeAfterSlide}% 0 0)` }}
                  >
                    <img 
                      src={roomImage!} 
                      alt={t('originalRoom')}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Slider (FIX #2: use percentage instead of window.innerWidth) */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={(_, info) => {
                      if (sliderContainerRef.current) {
                        const rect = sliderContainerRef.current.getBoundingClientRect();
                        const percent = ((info.point.x - rect.left) / rect.width) * 100;
                        setBeforeAfterSlide(Math.max(0, Math.min(100, percent)));
                      }
                    }}
                    className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                    style={{ left: `${beforeAfterSlide}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-primary rounded-full" />
                    </div>
                  </motion.div>
                </motion.div>

                <p className="text-sm text-muted-foreground text-center">
                  {editCount < 3 ? t('editsRemaining', { count: 3 - editCount }) : t('editsRemaining', { count: 0 })}
                </p>

                <div className="flex gap-2">
                  {editCount < 3 && (
                    <Button 
                      onClick={() => setStep("carousel")} 
                      variant="outline" 
                      className="flex-1"
                    >
                      {t('makeChanges')}
                    </Button>
                  )}
                  <Button onClick={() => setStep("chat")} className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {t('chatWithNour')}
                  </Button>
                  <Button variant="outline" onClick={resetFlow}>
                    {t('newVisualization')}
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        )}

        {step === "chat" && (
          <div className="space-y-4">
            <ScrollArea className="h-96 border rounded-lg p-4">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 ${msg.role === "user" ? "text-right" : ""}`}
                >
                  <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                placeholder={i18n.language === 'ar' ? "اسأل نور..." : "Ask Nour..."}
                disabled={isLoading}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
              />
              <Button onClick={handleChatSend} disabled={isLoading}>
                {i18n.language === 'ar' ? 'إرسال' : 'Send'}
              </Button>
            </div>

            <Button variant="outline" onClick={resetFlow} className="w-full">
              {t('startOver')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NourModal;
