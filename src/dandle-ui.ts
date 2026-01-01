/* Prompt 1: Dandle UI overlay (additive) */
export function initDandleUi() {
  "use strict";

  const FLAGS = {
    ENABLE_LANG_TOGGLE: true,
    ENABLE_HERO_MUTE: true,
  };

  const STORAGE_KEY = "dandle_lang";
  const DEFAULT_LANG: "en" | "ar" = "en";

  const I18N = {
    en: {
      toggleEn: "EN",
      toggleAr: "العربية",
      muted: "Sound Off",
      unmuted: "Sound On",
      whatsappCta: "Send Room → Ready in 72hrs",
    },
    ar: {
      toggleEn: "EN",
      toggleAr: "العربية",
      muted: "إيقاف الصوت",
      unmuted: "تشغيل الصوت",
      whatsappCta: "ارسل غرفتي → جاهز خلال 72 ساعة",
    },
  } as const;

  const FONT_LINKS = [
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500&display=swap",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
  ];

  function injectFonts() {
    for (const href of FONT_LINKS) {
      const already = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some((l) => (l as HTMLLinkElement).href.includes(href.split("?")[0]));
      if (already) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }
  }

  function injectStyles() {
    if (document.getElementById("dandle-ui-style")) return;
    const css = `
      .dandle-lang-toggle{
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        font-family: Cairo, system-ui, -apple-system, sans-serif;
        font-size: 16px;
        background: rgba(255,255,255,.92);
        backdrop-filter: blur(6px);
        padding: 8px 12px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,.08);
        user-select: none;
      }
      .dandle-lang-link{
        padding: 6px 10px;
        color: #333;
        text-decoration: none;
        font-weight: 600;
        display: inline-block;
        transition: color .2s, transform .1s;
      }
      .dandle-lang-link:active{transform: scale(.98);}
      .dandle-lang-link.active{
        font-weight: 900;
        color: #d4af37 !important;
      }

      /* RTL only affects data-ar elements, not existing content */
      [data-ar]{unicode-bidi: plaintext;}

      .dandle-mute-toggle{
        position: fixed;
        top: 70px;
        right: 20px;
        z-index: 9999;
        background: rgba(0,0,0,.65);
        color: #fff;
        border: 0;
        padding: 8px 16px;
        border-radius: 20px;
        font-family: Cairo, system-ui, -apple-system, sans-serif;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        backdrop-filter: blur(6px);
        transition: background 0.2s ease;
      }
      .dandle-mute-toggle:hover{background: rgba(0,0,0,.8);}
      .dandle-mute-toggle:active{transform: scale(.98);}
    `;
    const style = document.createElement("style");
    style.id = "dandle-ui-style";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function getLang(): "en" | "ar" {
    const v = localStorage.getItem(STORAGE_KEY);
    return (v === "ar" ? "ar" : "en");
  }

  function setLang(lang: "en" | "ar") {
    const safe: "en" | "ar" = lang === "ar" ? "ar" : "en";
    localStorage.setItem(STORAGE_KEY, safe);
    document.documentElement.lang = safe;
    // Set RTL direction for Arabic
    document.documentElement.dir = safe === "ar" ? "rtl" : "ltr";

    document.querySelectorAll<HTMLAnchorElement>(".dandle-lang-link").forEach((a) => {
      a.classList.toggle("active", a.dataset.lang === safe);
    });

    document.querySelectorAll<HTMLElement>("[data-en][data-ar]").forEach((el) => {
      const en = el.getAttribute("data-en") || el.textContent || "";
      const ar = el.getAttribute("data-ar") || el.textContent || "";
      el.textContent = safe === "ar" ? ar : en;
    });

    const wa = document.getElementById("whatsapp-order");
    if (wa) wa.textContent = I18N[safe].whatsappCta;
  }

  function mountLangToggle() {
    if (!FLAGS.ENABLE_LANG_TOGGLE) return;
    if (document.getElementById("dandleLangToggle")) return;

    const wrap = document.createElement("div");
    wrap.id = "dandleLangToggle";
    wrap.className = "dandle-lang-toggle";
    wrap.setAttribute("aria-label", "Language Toggle");

    const en = document.createElement("a");
    en.href = "#";
    en.className = "dandle-lang-link";
    en.dataset.lang = "en";
    en.textContent = I18N.en.toggleEn;

    const sep = document.createTextNode(" | ");

    const ar = document.createElement("a");
    ar.href = "#";
    ar.className = "dandle-lang-link";
    ar.dataset.lang = "ar";
    ar.textContent = I18N.ar.toggleAr;

    en.addEventListener("click", (e) => { e.preventDefault(); setLang("en"); });
    ar.addEventListener("click", (e) => { e.preventDefault(); setLang("ar"); });

    wrap.appendChild(en);
    wrap.appendChild(sep);
    wrap.appendChild(ar);

    document.body.appendChild(wrap);
  }

  function mountHeroMute() {
    if (!FLAGS.ENABLE_HERO_MUTE) return;
    if (document.getElementById("dandleMuteToggle")) return;

    const video = document.getElementById("heroVideo") as HTMLVideoElement | null;

    const btn = document.createElement("button");
    btn.id = "dandleMuteToggle";
    btn.className = "dandle-mute-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle hero sound");

    if (!video) {
      btn.style.display = "none";
      document.body.appendChild(btn);
      return;
    }

    video.muted = true;
    btn.textContent = I18N[getLang()].muted;

    btn.addEventListener("click", () => {
      video.muted = !video.muted;
      btn.textContent = video.muted ? I18N[getLang()].muted : I18N[getLang()].unmuted;
    });

    document.body.appendChild(btn);
  }

  function boot() {
    injectFonts();
    injectStyles();
    mountLangToggle();
    setLang(localStorage.getItem(STORAGE_KEY) === "ar" ? "ar" : DEFAULT_LANG);
    mountHeroMute();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  (window as any).DANDLE_UI = {
    setLang,
    getLang,
    flags: FLAGS,
  };
}
