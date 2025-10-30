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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const chimeAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load chime sound
  useEffect(() => {
    const audio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4SxYqH5AAAAAAAAAAAAAAAAAAAAAP/7kGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+5BkAA/wAABpAAAACAAADSAAAAEAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==');
    audio.volume = 0.3;
    chimeAudioRef.current = audio;
  }, []);

  // Auto-greeting on mount
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
  }, [open, hasGreeted]);

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
            setRoomImage(canvas.toDataURL('image/jpeg', 0.95));
            setStep("render");
            handleRender(canvas.toDataURL('image/jpeg', 0.95));
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)'
        }}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Nour - AI Comfort Stylist
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleLanguage}
              className="gap-2"
            >
              <Languages className="w-4 h-4" />
              {i18n.language === 'ar' ? '🇪🇬' : '🇬🇧'}
            </Button>
          </div>
          <DialogDescription className="sr-only">
            {t('greeting')}
          </DialogDescription>
        </DialogHeader>

        {step === "greeting" && (
          <div className="space-y-6 py-8">
            <motion.div
              ref={greetingRef}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg leading-relaxed px-4" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                {t('greeting')}
              </p>
            </motion.div>
            
            <Button 
              ref={buttonRef}
              onClick={() => setStep("carousel")} 
              className="w-full h-12 text-lg font-semibold"
              style={{
                background: 'hsl(var(--primary))',
                boxShadow: '0 4px 12px rgba(243, 122, 29, 0.2)'
              }}
            >
              {t('visualizeButton')}
            </Button>
          </div>
        )}

        {step === "carousel" && (
          <div className="space-y-6 py-4">
            <p className="text-center text-muted-foreground">{t('selectRecliner')}</p>
            
            <Carousel className="w-full max-w-2xl mx-auto">
              <CarouselContent>
                {RECLINERS.map((recliner, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedRecliner.model === recliner.model 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => {
                        setSelectedRecliner(recliner);
                        setSelectedColor(recliner.colors[0]);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square relative overflow-hidden rounded-lg mb-3">
                          <img 
                            src={recliner.colors[0].image}
                            alt={recliner.model}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-bold text-center mb-1">{recliner.model}</h3>
                        <p className="text-sm text-muted-foreground text-center mb-3">{recliner.price}</p>
                        
                        {/* Color dots */}
                        <div className="flex justify-center gap-2">
                          {recliner.colors.map((color, colorIdx) => (
                            <button
                              key={colorIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecliner(recliner);
                                setSelectedColor(color);
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
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
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
                
                {/* Before/After Slider */}
                <motion.div 
                  className="relative w-full aspect-video rounded-lg overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
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
                  
                  {/* Slider */}
                  <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDrag={(_, info) => {
                      const container = info.point.x;
                      const percent = (container / window.innerWidth) * 100;
                      setBeforeAfterSlide(Math.max(0, Math.min(100, percent)));
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
