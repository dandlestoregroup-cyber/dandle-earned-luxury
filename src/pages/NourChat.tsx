import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Camera, Download, ImagePlus, Loader2, MessageCircle, Sparkles, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { visualizationProducts } from "@/nour/visualizationCatalog";

const API = "/api/nour/v1/visualizations";
const WHATSAPP_NUMBER = "201222804255";
type ProductOption = { id: string; name: string; finishes: { id: string; label: string; image: string }[]; startingPrice: number | null };
type Preview = { image: string; requestId: string; createdAt: string; modelId: string; modelName: string; finishId: string; finishLabel: string; placement: string; notice: string };
type Room = { dataUrl: string; aspect: number };

function prepareImage(file: File): Promise<Room> {
  return new Promise((resolve, reject) => {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 15_000_000) return reject(new Error("Choose a JPEG, PNG or WebP photo under 15 MB."));
    const url = URL.createObjectURL(file);
    const image = new Image();
    const fail = (message: string) => { URL.revokeObjectURL(url); reject(new Error(message)); };
    image.onerror = () => fail("This photo could not be opened. Try another image.");
    image.onload = () => {
      const aspect = image.width / image.height;
      if (aspect < 0.33 || aspect > 3) return fail("Use a standard portrait or landscape crop.");
      const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) return fail("Photo processing is unavailable in this browser.");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      let quality = 0.82;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length > 2_600_000 && quality > 0.5) { quality -= 0.08; dataUrl = canvas.toDataURL("image/jpeg", quality); }
      URL.revokeObjectURL(url);
      if (dataUrl.length > 2_800_000) return reject(new Error("Choose a smaller room photo."));
      resolve({ dataUrl, aspect });
    };
    image.src = url;
  });
}

export default function NourChat() {
  const [isAr, setIsAr] = useState(false);
  const t = (en: string, ar: string) => isAr ? ar : en;
  const [catalogue, setCatalogue] = useState<ProductOption[]>(visualizationProducts.map((p) => ({ ...p, finishes: [...p.finishes], startingPrice: null })));
  const [availability, setAvailability] = useState<"loading" | "ready" | "unavailable">("loading");
  const [room, setRoom] = useState<Room | null>(null);
  const [modelId, setModelId] = useState("relaxmax");
  const [finishId, setFinishId] = useState("reference");
  const [placement, setPlacement] = useState("");
  const [consent, setConsent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [view, setView] = useState<"preview" | "original" | "compare">("preview");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const busyRef = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const uploadVersion = useRef(0);
  const product = catalogue.find((p) => p.id === modelId) || catalogue[0];
  const finish = product.finishes.find((f) => f.id === finishId) || product.finishes[0];
  const busy = rendering || processing;
  const canRender = availability === "ready" && room && consent && placement.trim() && !busy;

  useEffect(() => {
    const controller = new AbortController();
    fetch(API, { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!Array.isArray(data.products) || !data.products.length) throw new Error();
      setCatalogue(data.products);
      setAvailability(data.configured ? "ready" : "unavailable");
    }).catch(() => { if (!controller.signal.aborted) setAvailability("unavailable"); });
    return () => { controller.abort(); controllerRef.current?.abort(); uploadVersion.current += 1; };
  }, []);

  const whatsappUrl = useMemo(() => {
    const selected = preview ? catalogue.find((p) => p.id === preview.modelId) : product;
    const price = selected?.startingPrice;
    const text = ["I'd like to continue my Dandle Nour enquiry.", `Model: ${preview?.modelName || product.name}`,
      `Photographed finish: ${preview?.finishLabel || finish.label}`, `Placement: ${preview?.placement || placement || "To discuss"}`,
      ...(preview ? [`Preview reference: ${preview.requestId}`, "I have an AI appearance preview; I can attach the downloaded image."] : []),
      Number.isFinite(price) && price! > 0 ? `Catalogue starting price shown: EGP ${price!.toLocaleString("en-US")} (configuration to confirm).` : "Please confirm the current price.",
      "Please confirm the finish, measurements, recline clearance, availability and final quote."].join("\n");
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  }, [preview, catalogue, product, finish, placement]);

  const resetSelection = () => { setPreview(null); setError(""); };
  const attach = async (file?: File) => {
    if (!file || busyRef.current) return;
    const version = ++uploadVersion.current;
    setProcessing(true); setError("");
    try {
      const next = await prepareImage(file);
      if (version !== uploadVersion.current) return;
      setRoom(next); setPreviews([]); setPreview(null); setConsent(false); setAnswer("");
    } catch (failure) { if (version === uploadVersion.current) setError(failure instanceof Error ? failure.message : "Could not open photo."); }
    finally { if (version === uploadVersion.current) setProcessing(false); }
  };

  const createPreview = async () => {
    if (!canRender || !room || busyRef.current) return;
    busyRef.current = true; setRendering(true); setError("");
    const controller = new AbortController(); controllerRef.current = controller;
    try {
      const response = await fetch(API, { method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify({ modelId: product.id, finishId: finish.id, placement: placement.trim(), photoConsent: consent, roomImage: room.dataUrl, roomAspect: room.aspect }) });
      const data = await response.json();
      if (!response.ok || !data.visualQaPassed || typeof data.image !== "string" || !data.image.startsWith("data:image/")) throw new Error(data.error || "The preview did not pass its visual check.");
      if (!controller.signal.aborted) { setPreview(data); setPreviews((current) => [...current.slice(-2), data]); setView("preview"); }
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : "The preview could not finish.");
    } finally { busyRef.current = false; if (!controller.signal.aborted) setRendering(false); }
  };

  const askNour = async () => {
    if (!question.trim() || chatLoading) return;
    setChatLoading(true); setAnswer("");
    try {
      const response = await fetch("/api/nour", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        messages: [{ role: "user", content: `${question.trim()} Selected model: ${product.name}. Placement: ${placement}.` }],
        ...(consent && room ? { image: room.dataUrl } : {}),
      }) });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error();
      setAnswer(data.reply);
    } catch { setAnswer(t("Nour is temporarily unavailable. You can continue with Dandle below.", "نور غير متاحة مؤقتًا. تقدر تكمل مع داندل من الزر تحت.")); }
    finally { setChatLoading(false); }
  };

  return <div className="min-h-screen bg-warm-beige">
    <Navigation />
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8" dir={isAr ? "rtl" : "ltr"} lang={isAr ? "ar" : "en"}>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">NOUR · ROOM STUDIO</p>
          <h1 className="mt-3 max-w-3xl font-headline text-4xl leading-tight text-charcoal md:text-6xl">{t("Your room. Your next favourite seat.", "بيتك. وركنك المفضل الجديد.")}</h1>
          <p className="mt-4 max-w-xl text-base text-charcoal/70">{t("Picture a real Dandle in your space, before you choose.", "شوف موديل داندل في مكانك قبل ما تختار.")}</p>
        </div>
        <Button variant="outline" onClick={() => setIsAr(!isAr)} aria-label={t("Switch to Arabic", "التغيير للإنجليزية")}>{isAr ? "EN" : "عربي"}</Button>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="overflow-hidden rounded-3xl border border-bronze/20 bg-warm-white shadow-subtle lg:sticky lg:top-24" aria-label={t("Room preview", "تصور الغرفة")} aria-busy={busy}>
          <div className="flex items-center justify-between gap-3 border-b p-4 md:px-6"><span className="text-sm font-semibold">{t("01 / Your space", "١ / مكانك")}</span><span className="text-xs text-muted-foreground">{t("One photo is all you need", "صورة واحدة تكفي")}</span></div>
          <div className="p-4 md:p-6">
            {!room ? <button disabled={busy} onClick={() => fileRef.current?.click()} className="flex min-h-[380px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-bronze/40 bg-warm-beige/50 p-8 text-center transition hover:border-accent focus-visible:outline-accent">
              <span className="mb-5 rounded-full bg-white p-5 shadow-subtle"><Camera className="h-8 w-8 text-accent" /></span>
              <span className="text-2xl font-headline">{processing ? t("Opening your photo…", "جاري فتح الصورة…") : t("Bring your room into the picture", "ابدأ بصورة مكانك")}</span>
              <span className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{t("Choose a clear photo with the floor and the space for your recliner visible.", "اختار صورة واضحة يظهر فيها الأرض والمكان اللي تحب تحط فيه الكرسي.")}</span>
              <span className="mt-6 rounded-full bg-charcoal px-6 py-3 text-sm font-medium text-white">{t("Choose room photo", "اختار صورة المكان")}</span>
              <span className="mt-4 text-xs text-muted-foreground">JPG, PNG, WebP · {t("up to 15 MB", "لحد ١٥ ميجا")}</span>
            </button> : <>
              {preview && <div className="mb-4 flex gap-2" role="group" aria-label={t("Preview view", "طريقة عرض التصور")}>{(["preview", "original", "compare"] as const).map((mode) => <button key={mode} aria-pressed={view === mode} onClick={() => setView(mode)} className={`rounded-full px-4 py-2 text-xs ${view === mode ? "bg-charcoal text-white" : "bg-warm-beige"}`}>{mode === "preview" ? t("Preview", "التصور") : mode === "original" ? t("Original", "الأصل") : t("Compare", "قارن")}</button>)}</div>}
              <div className={`relative overflow-hidden rounded-2xl bg-warm-beige ${preview && view === "compare" ? "grid gap-2 sm:grid-cols-2" : ""}`}>
                {preview && view === "compare" ? <>{[[room.dataUrl, t("Original room", "الغرفة الأصلية")], [preview.image, t("AI preview", "تصور بالذكاء الاصطناعي")]].map(([src, label]) => <figure key={label}><img src={src} alt={label} className="h-64 w-full object-contain" /><figcaption className="p-2 text-center text-xs">{label}</figcaption></figure>)}</> : <img src={preview && view !== "original" ? preview.image : room.dataUrl} alt={preview && view !== "original" ? t("AI appearance preview", "تصور للشكل بالذكاء الاصطناعي") : t("Your original room", "غرفتك الأصلية")} className="max-h-[580px] min-h-64 w-full object-contain" />}
                {!busy && <button aria-label={t("Remove room photo", "حذف صورة المكان")} onClick={() => { uploadVersion.current += 1; setRoom(null); setPreviews([]); setPreview(null); setConsent(false); setAnswer(""); }} className="absolute end-3 top-3 rounded-full bg-white p-2 shadow"><X className="h-4 w-4" /></button>}
                {rendering && <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/85 p-6 text-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /><p className="font-medium">{t("Placing your Dandle. Checking the details.", "بنحط داندل في مكانك وبنراجع التفاصيل.")}</p><p className="text-xs text-muted-foreground">{t("Keep this page open. This can take a few minutes.", "خلي الصفحة مفتوحة. التصور ممكن ياخد كام دقيقة.")}</p></div>}
              </div>
              <div className="mt-4 flex flex-wrap gap-3"><Button variant="outline" disabled={busy} onClick={() => fileRef.current?.click()}><ImagePlus className="me-2 h-4 w-4" />{t("Change photo", "غير الصورة")}</Button>{preview && <a href={preview.image} download={`Nour-${preview.modelId}-${preview.requestId}.jpg`} className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm"><Download className="h-4 w-4" />{t("Download preview", "نزل التصور")}</a>}</div>
              {preview && <p className="mt-4 text-sm font-medium">{preview.modelName} · {preview.finishLabel}</p>}
              {previews.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto" aria-label={t("Your previews", "تصوراتك")}>{previews.map((item) => <button key={item.requestId} disabled={busy} onClick={() => { setPreview(item); setView("preview"); }} className={`w-24 shrink-0 overflow-hidden rounded-lg border-2 ${preview?.requestId === item.requestId ? "border-accent" : "border-transparent"}`}><img src={item.image} alt={item.modelName} className="h-16 w-full object-cover" /><span className="block p-1 text-[10px]">{item.modelName}</span></button>)}</div>}
            </>}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" aria-label="Upload room photo" onChange={(event) => { void attach(event.target.files?.[0]); event.target.value = ""; }} />
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{t("An appearance preview, not a measurement. Check dimensions and recline clearance before ordering.", "ده تصور للشكل. لازم تتأكد من المقاسات ومساحة فتح الكرسي قبل الطلب.")}</p>
          </div>
        </section>

        <aside className="space-y-5">
          <fieldset disabled={busy} className="rounded-3xl border border-bronze/20 bg-warm-white p-5 md:p-6">
            <legend className="sr-only">{t("Product and placement", "الموديل والمكان")}</legend>
            <h2 className="text-sm font-semibold">{t("02 / Choose your Dandle", "٢ / اختار داندل")}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">{catalogue.map((item) => <button key={item.id} type="button" aria-pressed={modelId === item.id} onClick={() => { setModelId(item.id); setFinishId(item.finishes[0].id); resetSelection(); }} className={`overflow-hidden rounded-xl border text-start transition ${modelId === item.id ? "border-accent ring-1 ring-accent" : "border-transparent bg-warm-beige/40 hover:border-bronze/30"}`}><img src={item.finishes[0].image} alt={item.name} className="aspect-[1.75] w-full object-cover" loading="lazy" /><span className="block px-3 py-2 text-xs font-semibold">{item.name}</span></button>)}</div>
            <label htmlFor="nour-finish" className="mt-5 block text-xs font-semibold">{t("Photographed finish", "التشطيب الموجود في الصورة")}</label>
            <select id="nour-finish" value={finish.id} onChange={(event) => { setFinishId(event.target.value); resetSelection(); }} className="mt-2 w-full rounded-lg border bg-white p-3 text-sm">{product.finishes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{t("We keep the real photographed finish. Other colours need a verified photo before we preview them.", "بنحافظ على التشطيب الحقيقي في الصورة. أي لون تاني محتاج صورة موثقة قبل التصور.")}</p>
            <div className="mt-5 flex items-baseline justify-between gap-3 border-t pt-4"><span className="text-xs text-muted-foreground">{t("Catalogue starting price", "سعر الكتالوج يبدأ من")}</span><strong className="text-xl">{product.startingPrice && Number.isFinite(product.startingPrice) && product.startingPrice > 0 ? `EGP ${product.startingPrice.toLocaleString("en-US")}` : t("Confirm with Dandle", "أكد مع داندل")}</strong></div>
            <p className="mt-1 text-xs text-muted-foreground">{t("Final configuration and availability confirmed with Dandle.", "المواصفات النهائية والتوفر بيتأكدوا مع داندل.")}</p>
            <label htmlFor="nour-placement" className="mt-6 block text-sm font-semibold">{t("03 / Where would you place it?", "٣ / تحب تحطه فين؟")}</label>
            <textarea id="nour-placement" value={placement} maxLength={240} onChange={(event) => { setPlacement(event.target.value); resetSelection(); }} placeholder={t("For example: the empty corner beside the window", "مثلاً: الركن الفاضي جنب الشباك")} rows={2} className="mt-3 w-full resize-none rounded-xl border bg-white p-3 text-sm" />
            <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted-foreground"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#9A7452]" />{t("I can use this photo and agree to send it to OpenAI for my preview and room advice. It won't be published by Dandle.", "عندي حق استخدام الصورة وموافق إنها تتبعت لـ OpenAI للتصور والنصيحة عن المكان. داندل مش هتنشرها.")}</label>
            <Button className="mt-5 w-full rounded-xl py-6 text-base" onClick={createPreview} disabled={!canRender}>{rendering ? <Loader2 className="me-2 h-5 w-5 animate-spin" /> : <Sparkles className="me-2 h-5 w-5" />}{t(rendering ? "Creating your preview…" : "See it in my room", rendering ? "بنعمل تصورك…" : "شوفه في مكانك")}</Button>
            {availability !== "ready" && <p role="status" className="mt-3 text-xs leading-relaxed text-muted-foreground">{availability === "loading" ? t("Checking preview availability…", "بنتأكد من توفر التصور…") : t("Room previews are being prepared. Explore the products and continue with Dandle below.", "بنجهز خدمة التصور. اختار الموديل وكمل مع داندل من تحت.")}</p>}
          </fieldset>
          {error && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}</p>}
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-bronze/30 bg-warm-white p-5 text-sm font-semibold"><span className="flex items-center gap-3"><MessageCircle className="h-5 w-5 text-accent" />{t("Continue with Dandle", "كمل مع داندل")}</span><ArrowRight className="h-4 w-4" /></a>
          {preview && <p className="px-2 text-xs text-muted-foreground">{t("Download your preview to attach in WhatsApp. Your photo is not included in the link.", "نزل التصور وارفقه في واتساب. صورتك مش موجودة في اللينك.")}</p>}
          <details className="rounded-2xl border border-bronze/20 bg-warm-white p-5"><summary className="cursor-pointer text-sm font-medium">{t("Need help choosing a placement? Ask Nour", "محتاج مساعدة في المكان؟ اسأل نور")}</summary><label htmlFor="nour-question" className="sr-only">{t("Your question", "سؤالك")}</label><input id="nour-question" value={question} maxLength={500} onChange={(event) => setQuestion(event.target.value)} placeholder={t("Ask about your room…", "اسأل عن مكانك…")} className="mt-4 w-full rounded-lg border bg-white p-3 text-sm" /><Button variant="outline" className="mt-3" onClick={askNour} disabled={!question.trim() || chatLoading || busy}>{chatLoading ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <MessageCircle className="me-2 h-4 w-4" />}{t("Ask Nour", "اسأل نور")}</Button>{answer && <p role="status" className="mt-4 text-sm leading-relaxed">{answer}</p>}</details>
        </aside>
      </div>
    </main>
    <Footer />
  </div>;
}
