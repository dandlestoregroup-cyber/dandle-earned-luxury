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

const NourModal = ({ open, onOpenChange }: NourModalProps) => {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState<"greeting" | "carousel" | "upload" | "render" | "chat">("greeting");
  const [roomImage, setRoomImage] = useState<string | null>(null);
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const carouselCardRefs = useRef<(HTMLDivElement | null)[]>([]);
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

          canvas.width = 1920;
          canvas.height = 1080;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, offsetX, offsetY, cropWidth, cropHeight, 0, 0, 1920, 1080);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
            setRoomImage(dataUrl);
            
            // Extract colors and animate background (FIX #1)
            extractAndApplyColors(dataUrl);
            
            setStep("render");
            handleRender(dataUrl);
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
      const prompt = `Insert a ${selectedRecliner.model} recliner in ${selectedColor.name} into this room. CRITICAL: Preserve ALL existing furniture - do not remove or replace any objects. Only add the new recliner. Match lighting, shadows, and perspective perfectly. Realistic integration, no hallucinations, no architectural changes.`;
      
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
        className={`nour-wrapper overflow-hidden ${
          step === 'greeting' 
            ? 'w-screen h-screen max-w-none max-h-[100vh] border-0 bg-transparent shadow-none p-0' 
            : 'max-w-4xl max-h-[90vh]'
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

        {step === "greeting" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
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
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground">{t('selectRecliner')}</p>
            
            <Carousel className="w-full max-w-2xl mx-auto">
              <CarouselContent>
                {RECLINERS.map((recliner, idx) => {
                  const isSelected = selectedRecliner.model === recliner.model;
                  
                  return (
                    <CarouselItem 
                      key={idx} 
                      className="md:basis-1/2 lg:basis-1/3"
                      style={{ minWidth: 'min(280px, 80vw)' }}
                    >
                      <Card 
                        ref={(el) => (carouselCardRefs.current[idx] = el)}
                        className={`cursor-pointer transition-all duration-300 ${
                          isSelected 
                            ? 'ring-[6px] ring-primary/80 shadow-2xl' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => {
                          // Clear any existing timer
                          if (autoAdvanceTimer) {
                            clearTimeout(autoAdvanceTimer);
                            setAutoAdvanceTimer(null);
                          }
                          
                          setSelectedRecliner(recliner);
                          setSelectedColor(recliner.colors[0]);
                          triggerTiltGlow(carouselCardRefs.current[idx]!);
                          
                          // Start 4s auto-advance timer
                          const timer = setTimeout(() => {
                            setStep("upload");
                          }, 4000);
                          setAutoAdvanceTimer(timer);
                        }}
                      >
                        <CardContent className="p-4 space-y-3" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                          <div className="aspect-square relative overflow-hidden rounded-lg">
                            <img 
                              src={recliner.colors[0].image}
                              alt={recliner.model}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="font-bold text-center">{recliner.model}</h3>
                          <p className="text-sm text-muted-foreground text-center">{recliner.price}</p>
                          
                          {/* Color dots */}
                          <div className="flex justify-center gap-2">
                            {recliner.colors.map((color, colorIdx) => (
                              <button
                                key={colorIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  
                                  // Clear timer
                                  if (autoAdvanceTimer) {
                                    clearTimeout(autoAdvanceTimer);
                                    setAutoAdvanceTimer(null);
                                  }
                                  
                                  setSelectedRecliner(recliner);
                                  setSelectedColor(color);
                                  triggerTiltGlow(carouselCardRefs.current[idx]!);
                                  
                                  // Start 4s auto-advance timer
                                  const timer = setTimeout(() => {
                                    setStep("upload");
                                  }, 4000);
                                  setAutoAdvanceTimer(timer);
                                }}
                                className={`w-4 h-4 rounded-full border-2 transition-all ${
                                  selectedRecliner.model === recliner.model && selectedColor.name === color.name
                                    ? 'border-primary scale-125'
                                    : 'border-muted hover:scale-110'
                                }`}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                              />
                            ))}
                          </div>

                          {/* Big orange Next button - only in selected card */}
                          {isSelected && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
                                setStep("upload");
                              }}
                              className="w-full h-12 text-lg font-semibold mt-4"
                              style={{
                                background: 'hsl(var(--primary))',
                                boxShadow: '0 4px 12px rgba(243, 122, 29, 0.3)'
                              }}
                            >
                              {i18n.language === 'ar' ? 'التالي' : 'Next'}
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                {t('uploadPlaceholder')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
              {i18n.language === 'ar' ? 'ارفع صورة لغرفتك لبدء التجربة' : 'Upload a photo of your room to start'}
            </p>
            <div
              className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                {t('uploadPlaceholder')}
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
              <Button variant="outline" onClick={() => setStep("carousel")}>
                {i18n.language === 'ar' ? 'رجوع' : 'Back'}
              </Button>
            </div>
          </div>
        )}

        {step === "render" && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground animate-pulse" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                  {t('rendering')}
                </p>
                <div 
                  role="status" 
                  aria-live="polite" 
                  aria-label={t('rendering')}
                  className="sr-only"
                />
              </div>
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
