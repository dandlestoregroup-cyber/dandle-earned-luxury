import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Check,
  Image as ImageIcon,
  Loader2,
  Mic,
  MicOff,
  Paperclip,
  Ruler,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/types/product";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: Recommendation[];
  source?: string;
};

type Recommendation = {
  id: string;
  name: string;
  reason: string;
  image: string;
  href: string;
};

type FitProfile = {
  roomDepth: string;
  doorWidth: string;
  budget: string;
  loadRequirement: string;
};

type SpeechRecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  start: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

const goals = [
  { en: "Everyday comfort", ar: "راحة يومية" },
  { en: "Mobility support", ar: "مساعدة في الحركة" },
  { en: "Small space", ar: "مساحة صغيرة" },
  { en: "Work or reading", ar: "شغل أو قراءة" },
  { en: "Massage and relaxation", ar: "مساج واسترخاء" },
  { en: "Comfort for two", ar: "راحة لشخصين" },
];

const initialMessages = (isAr: boolean): Message[] => [
  {
    id: "welcome",
    role: "assistant",
    content: isAr
      ? "أهلًا، أنا نور. هساعدك تختار الكرسي الأنسب للمكان وطريقة استخدامك، وهفضل معاك هنا لحد ما نوصل لاختيار واضح. ممكن تبدأ بهدفك، تبعت صورة للمكان، أو تدخل المقاسات."
      : "Hi, I’m Nour. I’ll help you choose the right Dandle for your room and the way you live, and I’ll stay with you until the choice is clear. Start with your goal, send a room photo, or add measurements.",
  },
];

function formatPrice(id: string) {
  const product = products.find((item) => item.id === id);
  const price = product?.price ?? product?.priceManual ?? product?.pricePower;
  return price ? `EGP ${price.toLocaleString("en-US")}` : "Confirm at order";
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Could not open image"));
      image.onload = () => {
        const max = 1280;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function NourChat() {
  const navigate = useNavigate();
  const [isAr, setIsAr] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages(false));
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [fitOpen, setFitOpen] = useState(false);
  const [fit, setFit] = useState<FitProfile>({
    roomDepth: "",
    doorWidth: "",
    budget: "",
    loadRequirement: "",
  });
  const [fitSaved, setFitSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    timelineRef.current?.scrollTo({ top: timelineRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [isAr]);

  const fitWarning = useMemo(() => {
    const depth = Number(fit.roomDepth);
    const door = Number(fit.doorWidth);
    const budget = Number(fit.budget);
    if (door && door < 74) {
      return isAr
        ? "عرض الباب أقل من 74 سم. لازم نراجع الدخول والتركيب يدويًا قبل تأكيد أي موديل."
        : "Door width is under 74 cm. Access and installation need manual verification before any model is confirmed.";
    }
    if (depth && depth < 130) {
      return isAr
        ? "العمق محدود؛ هنعطي أولوية لـ SpaceSaver ونحتاج قياس وضع الاستلقاء قبل الطلب."
        : "Depth is tight; SpaceSaver gets priority and reclined clearance must be checked before ordering.";
    }
    if (budget && budget < 21900) {
      return isAr
        ? "الميزانية أقل من أقل سعر حالي ظاهر. مش هاقترح موديل خارج الميزانية."
        : "The budget is below the lowest current website price. I won’t recommend a model outside it.";
    }
    if (fit.loadRequirement) {
      return isAr
        ? "قدرة التحمل لازم تتأكد من فريق داندل قبل الطلب؛ نور مش هتخمن رقم غير موثّق."
        : "Load capacity must be verified by Dandle before order; Nour will not invent an unverified rating.";
    }
    return "";
  }, [fit, isAr]);

  const resetLanguage = () => {
    setIsAr((value) => {
      const next = !value;
      setMessages(initialMessages(next));
      return next;
    });
  };

  const attachImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    try {
      setImage(await compressImage(file));
    } catch {
      setImage(null);
    }
  };

  const startVoice = () => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognition =
      speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput(
        isAr
          ? "المتصفح ده لا يدعم الإملاء الصوتي. اكتب رسالتك وأنا معاك."
          : "This browser does not support voice dictation. Type your message and I’m with you.",
      );
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = isAr ? "ar-EG" : "en-US";
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      setInput((current) => `${current} ${event.results[0][0].transcript}`.trim());
    };
    recognition.start();
  };

  const send = async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if ((!text && !image) || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text || (isAr ? "حلّل صورة المكان دي." : "Please analyse this room photo."),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/nour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          image,
          fit,
        }),
      });
      if (!response.ok) throw new Error("Nour unavailable");
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          recommendations: data.recommendations,
          source: data.source,
        },
      ]);
      setImage(null);
    } catch {
      const relax = products.find((product) => product.id === "relaxmax")!;
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: isAr
            ? "أنا موجودة. أقرب نقطة بداية هي RelaxMax للراحة اليومية، لكن مش هاعتبره اختيار نهائي قبل المقاسات والميزانية. افتح بطاقة المقاسات وأنا أكمل معاك هنا."
            : "I’m here. RelaxMax is the safest everyday starting point, but I won’t call it final without measurements and budget. Open the fit card and I’ll continue here.",
          recommendations: [
            {
              id: relax.id,
              name: relax.name,
              reason: isAr ? "بداية متوازنة للراحة اليومية." : "A balanced everyday starting point.",
              image: relax.imageUrl,
              href: `/products/${relax.id}`,
            },
          ],
          source: "local-fallback",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveFit = () => {
    setFitSaved(true);
    setFitOpen(false);
    const summary = isAr
      ? `المقاسات: عمق ${fit.roomDepth || "غير محدد"} سم، باب ${fit.doorWidth || "غير محدد"} سم، ميزانية ${fit.budget || "غير محددة"} ج.م.`
      : `Fit details: depth ${fit.roomDepth || "not set"} cm, door ${fit.doorWidth || "not set"} cm, budget EGP ${fit.budget || "not set"}.`;
    send(summary);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-beige">
      <Navigation />
      <main className="flex-1 px-3 pb-8 pt-24 md:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="flex min-h-[78vh] flex-col overflow-hidden rounded-2xl border border-bronze/20 bg-warm-white shadow-luxury">
            <header className="flex items-center justify-between gap-4 border-b border-bronze/20 px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-headline font-bold text-charcoal">
                    {isAr ? "نور من داندل" : "Nour by Dandle"}
                  </h1>
                  <p className="text-xs text-charcoal/60">
                    {isAr ? "اختيار، مقاس، ألوان ومكان" : "Comfort, fit, colour and placement"}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={resetLanguage}>
                {isAr ? "EN" : "عربي"}
              </Button>
            </header>

            <div ref={timelineRef} className="flex-1 overflow-y-auto px-4 py-5 md:px-6">
              <div className="mx-auto max-w-3xl space-y-5">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed md:max-w-[76%] ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "border bg-background text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === "assistant" && message.source === "deterministic" && (
                          <p className="mt-2 text-[10px] opacity-60">
                            {isAr ? "الوضع الاحتياطي الموثّق" : "Verified fallback mode"}
                          </p>
                        )}
                      </div>
                    </div>

                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        {message.recommendations.map((item) => (
                          <article key={item.id} className="overflow-hidden rounded-xl border bg-background">
                            <img src={item.image} alt={item.name} className="h-32 w-full object-cover" />
                            <div className="p-3">
                              <h3 className="text-lg">{item.name}</h3>
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
                              <p className="mt-2 text-xs font-semibold text-accent">
                                {isAr ? `يبدأ من ${formatPrice(item.id)}` : `From ${formatPrice(item.id)}`}
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 w-full"
                                onClick={() => navigate(item.href)}
                              >
                                {isAr ? "شوف التفاصيل" : "View details"}
                              </Button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {messages.length === 1 && (
                  <div className="flex flex-wrap gap-2">
                    {goals.map((goal) => (
                      <button
                        key={goal.en}
                        onClick={() => send(isAr ? goal.ar : goal.en)}
                        className="rounded-full border bg-background px-4 py-2 text-xs transition hover:border-accent hover:text-accent"
                      >
                        {isAr ? goal.ar : goal.en}
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isAr ? "نور بتراجع الاختيارات..." : "Nour is checking the fit..."}
                  </div>
                )}
              </div>
            </div>

            {image && (
              <div className="mx-4 mb-2 flex items-center gap-3 rounded-xl border bg-background p-2 md:mx-6">
                <img src={image} alt="Room attachment" className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{isAr ? "صورة المكان جاهزة" : "Room photo ready"}</p>
                  <p className="text-xs text-muted-foreground">
                    {isAr ? "نور هتحلل التوزيع والدخول، مش هتخمن المقاسات." : "Nour will analyse layout and access, not invent measurements."}
                  </p>
                </div>
                <button onClick={() => setImage(null)} aria-label="Remove image">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <footer className="border-t bg-warm-white p-3 md:p-4">
              <div className="mx-auto flex max-w-3xl items-end gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(event) => attachImage(event.target.files?.[0])}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => fileRef.current?.click()}
                  title={isAr ? "ارفع صورة" : "Attach room photo"}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={startVoice}
                  title={isAr ? "اتكلم" : "Voice input"}
                >
                  {listening ? <MicOff className="h-4 w-4 text-accent" /> : <Mic className="h-4 w-4" />}
                </Button>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      send();
                    }
                  }}
                  placeholder={isAr ? "قول لنور محتاج إيه..." : "Tell Nour what you need..."}
                  rows={1}
                  className="max-h-32 min-h-10 flex-1 resize-none rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <Button size="icon" onClick={() => send()} disabled={loading || (!input.trim() && !image)}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </footer>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border bg-warm-white p-5 shadow-subtle">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    {isAr ? "تأكيد الملاءمة" : "Fit check"}
                  </p>
                  <h2 className="mt-1 text-2xl">{isAr ? "قبل التأكيد" : "Before we confirm"}</h2>
                </div>
                {fitSaved ? <Check className="h-5 w-5 text-emerald-600" /> : <Ruler className="h-5 w-5" />}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {isAr
                  ? "نور تقدر ترشح مبدئيًا فورًا. التأكيد النهائي يحتاج عمق المكان، عرض الباب، الميزانية وقدرة التحمل المطلوبة."
                  : "Nour can recommend immediately. Final confirmation needs room depth, door width, budget and required load capacity."}
              </p>
              <Button className="mt-4 w-full" variant="outline" onClick={() => setFitOpen((value) => !value)}>
                {fitOpen
                  ? isAr ? "اقفل المقاسات" : "Close measurements"
                  : fitSaved
                    ? isAr ? "عدّل المقاسات" : "Edit measurements"
                    : isAr ? "دخل المقاسات" : "Add measurements"}
              </Button>

              {fitOpen && (
                <div className="mt-4 space-y-3 border-t pt-4">
                  <FitInput
                    label={isAr ? "عمق المكان (سم)" : "Room depth (cm)"}
                    value={fit.roomDepth}
                    onChange={(value) => setFit({ ...fit, roomDepth: value })}
                  />
                  <FitInput
                    label={isAr ? "عرض الباب (سم)" : "Door width (cm)"}
                    value={fit.doorWidth}
                    onChange={(value) => setFit({ ...fit, doorWidth: value })}
                  />
                  <FitInput
                    label={isAr ? "الميزانية (ج.م)" : "Budget (EGP)"}
                    value={fit.budget}
                    onChange={(value) => setFit({ ...fit, budget: value })}
                  />
                  <FitInput
                    label={isAr ? "قدرة التحمل المطلوبة (كجم)" : "Required load capacity (kg)"}
                    value={fit.loadRequirement}
                    onChange={(value) => setFit({ ...fit, loadRequirement: value })}
                  />
                  {fitWarning && (
                    <p className="rounded-lg bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
                      {fitWarning}
                    </p>
                  )}
                  <Button className="w-full" onClick={saveFit} disabled={loading}>
                    {isAr ? "احفظ وخلي نور تكمل" : "Save and continue with Nour"}
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-card p-5">
              <div className="flex gap-3">
                <Camera className="mt-0.5 h-5 w-5 text-accent" />
                <div>
                  <p className="font-semibold">{isAr ? "حلّل المكان" : "Room analysis"}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {isAr
                      ? "صوّر الباب، مكان الكرسي والمساحة وراءه في صورة واضحة."
                      : "Include the doorway, intended chair position and clearance behind it."}
                  </p>
                </div>
              </div>
              <Button className="mt-4 w-full" variant="outline" onClick={() => fileRef.current?.click()}>
                <ImageIcon className="mr-2 h-4 w-4" />
                {isAr ? "ارفع صورة المكان" : "Upload room photo"}
              </Button>
            </div>

            <a
              href="https://wa.link/dandle-recliners"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-2xl border bg-card p-5 text-sm transition hover:border-accent/50"
            >
              <div>
                <p className="font-semibold">{isAr ? "محتاج مساعدة بشرية؟" : "Want a human check?"}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isAr ? "اختياري بعد ما نور تجاوبك." : "Optional after Nour has answered."}
                </p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function FitInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium">{label}</span>
      <Input
        type="number"
        inputMode="numeric"
        min="0"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
