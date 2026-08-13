import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, MessageCircle, Paperclip, Send, Sparkles, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/types/product";

type Message = { id: string; role: "user" | "assistant"; content: string };
type RenderResult = { image: string; attempts: number; source: string };
type PreparedImage = { dataUrl: string; aspect: number };

const MODELS = [
  { id: "relaxmax", name: "RelaxMax", ready: true },
  { id: "comfortplus", name: "ComfortPlus", ready: false },
  { id: "easyup", name: "EasyUp Standard", ready: true },
  { id: "easyup-compact", name: "EasyUp Compact", ready: true },
  { id: "spacesaver", name: "SpaceSaver", ready: true },
  { id: "worknest", name: "WorkNest", ready: false },
  { id: "diva", name: "Diva", ready: true },
  { id: "cozycompanion", name: "CozyCompanion", ready: true },
  { id: "complete-set", name: "Dandle Complete Set", ready: false },
] as const;

const MATERIALS = ["Leather", "Textured Leather", "Linen", "Velvet"] as const;
const DIVA_COLOURS = ["Olive Beige", "Dusty Rose", "Burnt Orange", "Midnight Green", "Blue Grey", "Ivory Cream"] as const;
const WHATSAPP_NUMBER = "201222804255";

function prepareImage(file: File): Promise<PreparedImage> {
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
        const context = canvas.getContext("2d");
        if (!context) return reject(new Error("Image processing unavailable"));
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        let quality = 0.82;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > 2_600_000 && quality > 0.58) {
          quality -= 0.06;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        if (dataUrl.length > 2_800_000) return reject(new Error("Image is too large"));
        resolve({ dataUrl, aspect: image.width / image.height });
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function startingPrice(id: string) {
  const item = products.find((product) => product.id === id);
  const values = [item?.price, item?.priceManual, item?.pricePower]
    .filter((value): value is number => typeof value === "number");
  return values.length ? Math.min(...values) : null;
}

export default function NourChat() {
  const [isAr, setIsAr] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "I help you avoid the expensive mistake of choosing furniture that looks right but feels wrong in your home. Send one room photo and I’ll help you picture a real Dandle in it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [roomAspect, setRoomAspect] = useState(1);
  const [modelId, setModelId] = useState("relaxmax");
  const [material, setMaterial] = useState<(typeof MATERIALS)[number]>("Leather");
  const [colour, setColour] = useState("");
  const [placement, setPlacement] = useState("Open corner beside the main sofa");
  const [chatLoading, setChatLoading] = useState(false);
  const [renderLoading, setRenderLoading] = useState(false);
  const [render, setRender] = useState<RenderResult | null>(null);
  const [renderError, setRenderError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const selectedModel = MODELS.find((model) => model.id === modelId)!;
  const price = startingPrice(modelId);

  useEffect(() => {
    document.documentElement.lang = isAr ? "ar" : "en";
    document.documentElement.dir = isAr ? "rtl" : "ltr";
  }, [isAr]);

  const canRender = Boolean(roomImage && selectedModel.ready && material && placement.trim() && !renderLoading);

  const whatsAppUrl = useMemo(() => {
    const body = [
      "Dandle Nour confirmation",
      `Model: ${selectedModel.name}`,
      `Material: ${material}`,
      `Colour: ${colour || "Reference colour"}`,
      `Price: ${price ? `EGP ${price.toLocaleString("en-US")} starting price shown on website` : "Confirm with Dandle"}`,
      "Production time: Confirm with Dandle",
      `Placement visualized: ${placement}`,
      "I have a Nour room visualization and would like to continue.",
    ].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
  }, [selectedModel.name, material, colour, price, placement]);

  const attachImage = async (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setRender(null);
    setRenderError("");
    try {
      const prepared = await prepareImage(file);
      setRoomImage(prepared.dataUrl);
      setRoomAspect(prepared.aspect);
    } catch (error) {
      setRoomImage(null);
      setRenderError(
        error instanceof Error && error.message === "Image is too large"
          ? isAr ? "الصورة كبيرة جدا. جرب صورة أصغر." : "That photo is too large. Try a smaller image."
          : isAr ? "الصورة ما اتفتحتش. جرب صورة تانية." : "That image could not be opened. Try another photo.",
      );
    }
  };

  const send = async () => {
    const text = input.trim();
    if ((!text && !roomImage) || chatLoading) return;
    const userText = text || (
      isAr
        ? "اقرأ صورة المكان واقترح 3 أماكن شكلهم طبيعي للكرسي."
        : "Read this room photo and suggest 3 visually natural placements for the chair."
    );
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: userText };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/nour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })), image: roomImage }),
      });
      if (!response.ok) throw new Error("Nour unavailable");
      const data = await response.json();
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: isAr
            ? "اختار مكان واضح من الصورة، مثل الركن الفاضي جنب الكنبة، وأنا أستخدمه في التصور."
            : "Choose a visible open area, such as the empty corner beside the sofa, and I’ll use it for the visualization.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const createVisualization = async () => {
    if (!canRender || !roomImage) return;
    setRenderLoading(true);
    setRender(null);
    setRenderError("");

    try {
      const response = await fetch("/api/nour-render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomImage,
          roomAspect,
          modelId,
          modelName: selectedModel.name,
          material,
          colour,
          placement,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.approved || !data.image) {
        throw new Error(data.error || "Visualization failed quality check");
      }
      setRender({ image: data.image, attempts: data.attempts || 1, source: data.source || "openai" });
    } catch (error) {
      setRenderError(error instanceof Error ? error.message : "Nour could not make a verified visual from this photo.");
    } finally {
      setRenderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-beige">
      <Navigation />
      <main className="px-3 pb-12 pt-24 md:px-6">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Nour by Dandle</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-headline font-bold text-charcoal md:text-5xl">
                {isAr ? "شوف داندل في بيتك قبل ما تختار" : "See Dandle in your room before you choose"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
                {isAr
                  ? "ارفع صورة واحدة للمكان. نور تعمل تصور واقعي للموديل داخل نفس الغرفة. ده تصور للشكل والإحساس، مش قياس هندسي أو AR."
                  : "Upload one room photo. Nour creates a realistic visualization of the selected Dandle inside that same room. It is an appearance tool, not a measurement or AR fit check."}
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsAr((value) => !value)}>{isAr ? "EN" : "عربي"}</Button>
          </header>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="overflow-hidden rounded-2xl border border-bronze/20 bg-warm-white shadow-luxury">
              <div className="border-b p-4 md:p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-accent" />
                  <h2 className="text-2xl">{isAr ? "استوديو نور" : "Nour Room Studio"}</h2>
                </div>
              </div>

              <div className="p-4 md:p-6">
                {!roomImage ? (
                  <button onClick={() => fileRef.current?.click()} className="flex min-h-80 w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-background p-8 text-center transition hover:border-accent">
                    <Camera className="mb-4 h-10 w-10 text-accent" />
                    <span className="text-xl font-semibold">{isAr ? "ارفع صورة المكان" : "Upload your room photo"}</span>
                    <span className="mt-2 max-w-md text-sm text-muted-foreground">
                      {isAr ? "صورة واضحة من الزاوية اللي تحب تشوف فيها الكرسي." : "Use a clear photo from the viewpoint where you want to see the recliner."}
                    </span>
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl bg-black/5">
                    <img src={render?.image || roomImage} alt={render ? "Nour room visualization" : "Room"} className="max-h-[620px] w-full object-contain" />
                    <button onClick={() => { setRoomImage(null); setRender(null); }} className="absolute right-3 top-3 rounded-full bg-white p-2 shadow" aria-label="Remove room photo"><X className="h-4 w-4" /></button>
                    {render && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold shadow">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        {isAr ? "اجتاز فحص نور" : "Passed Nour quality check"}
                      </div>
                    )}
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(event) => attachImage(event.target.files?.[0])} />

                {renderError && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">{renderError}</p>}
                {roomImage && !render && (
                  <Button variant="outline" className="mt-4" onClick={() => fileRef.current?.click()}>
                    <Paperclip className="mr-2 h-4 w-4" />{isAr ? "غير الصورة" : "Change room photo"}
                  </Button>
                )}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-2xl border bg-warm-white p-5 shadow-subtle">
                <h2 className="text-2xl">{isAr ? "1. اختار الموديل" : "1. Choose the model"}</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {MODELS.map((model) => (
                    <button key={model.id} onClick={() => { setModelId(model.id); setRender(null); setColour(""); }} className={`rounded-xl border p-3 text-left text-sm transition ${modelId === model.id ? "border-accent bg-accent/5" : "bg-background"}`}>
                      <span className="block font-semibold">{model.name}</span>
                      {!model.ready && <span className="mt-1 block text-[11px] text-amber-700">{isAr ? "محتاج صورة مرجعية حقيقية" : "Real reference photo needed"}</span>}
                    </button>
                  ))}
                </div>
                {!selectedModel.ready && (
                  <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
                    {isAr
                      ? "نور مش هتستخدم صورة غير موثقة أو AI كمرجع للمنتج. مطلوب صورة حقيقية واضحة لتفعيل التصور للموديل ده."
                      : "Nour will not use an unverified or AI product image as product truth. A clean real reference photo is required to activate visualization for this model."}
                  </p>
                )}
              </section>

              <section className="rounded-2xl border bg-warm-white p-5 shadow-subtle">
                <h2 className="text-2xl">{isAr ? "2. الخامة واللون" : "2. Material and colour"}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {MATERIALS.map((item) => (
                    <button key={item} onClick={() => { setMaterial(item); setRender(null); }} className={`rounded-full border px-3 py-2 text-xs ${material === item ? "border-accent bg-accent/10 text-accent" : "bg-background"}`}>{item}</button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {isAr
                    ? "دي أسماء الخامات الموثقة. صور الخامات الحقيقية ما زالت مطلوبة للدقة الكاملة، ونور مش هتخترع texture."
                    : "These are the verified material families. Real swatch photography is still required for exact material fidelity; Nour will not invent digital swatches."}
                </p>
                {modelId === "diva" ? (
                  <select value={colour} onChange={(event) => { setColour(event.target.value); setRender(null); }} className="mt-4 w-full rounded-lg border bg-white px-3 py-2 text-sm">
                    <option value="">Reference colour</option>
                    {DIVA_COLOURS.map((item) => <option key={item}>{item}</option>)}
                  </select>
                ) : (
                  <input value={colour} onChange={(event) => { setColour(event.target.value); setRender(null); }} placeholder={isAr ? "اتجاه اللون للتصور فقط" : "Colour direction for the visual only"} className="mt-4 w-full rounded-lg border bg-white px-3 py-2 text-sm" />
                )}
              </section>

              <section className="rounded-2xl border bg-warm-white p-5 shadow-subtle">
                <h2 className="text-2xl">{isAr ? "3. قول لنور تحطه فين" : "3. Tell Nour where to place it"}</h2>
                <input value={placement} onChange={(event) => { setPlacement(event.target.value); setRender(null); }} className="mt-4 w-full rounded-lg border bg-white px-3 py-3 text-sm" />
                <Button variant="outline" className="mt-3 w-full" onClick={() => send()} disabled={!roomImage || chatLoading}>
                  {chatLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                  {isAr ? "اقترح أماكن من الصورة" : "Suggest placements from my photo"}
                </Button>
                <div className="mt-4 max-h-48 space-y-2 overflow-y-auto rounded-xl bg-background p-3 text-xs">
                  {messages.slice(-3).map((message) => (
                    <p key={message.id} className={message.role === "assistant" ? "text-foreground" : "text-muted-foreground"}>{message.content}</p>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={isAr ? "اسأل نور..." : "Ask Nour..."} className="min-w-0 flex-1 rounded-lg border bg-white px-3 py-2 text-sm" />
                  <Button size="icon" onClick={() => send()} disabled={chatLoading || (!input.trim() && !roomImage)}><Send className="h-4 w-4" /></Button>
                </div>
              </section>

              <Button className="w-full py-6 text-base" onClick={createVisualization} disabled={!canRender}>
                {renderLoading ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" />{isAr ? "نور بتعمل وتراجع التصور..." : "Nour is creating and checking your visual..."}</>
                ) : (
                  <><Sparkles className="mr-2 h-5 w-5" />{isAr ? "شوفه في مكانك" : "Visualize it in my room"}</>
                )}
              </Button>

              {render && (
                <a href={whatsAppUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl border border-accent bg-white px-4 py-4 font-semibold text-accent transition hover:bg-accent/5">
                  <MessageCircle className="mr-2 h-5 w-5" />{isAr ? "كمل مع داندل على WhatsApp" : "Continue with Dandle on WhatsApp"}
                </a>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
