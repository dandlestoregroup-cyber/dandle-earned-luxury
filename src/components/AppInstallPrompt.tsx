import { useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

const isIos = () => /iphone|ipad|ipod/i.test(window.navigator.userAgent);

export default function AppInstallPrompt() {
  const deferred = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem("dandle-app-install-dismissed") === "1") return;

    const visits = Number(localStorage.getItem("dandle-app-visits") || "0") + 1;
    localStorage.setItem("dandle-app-visits", String(visits));

    const handler = (event: Event) => {
      event.preventDefault();
      deferred.current = event as BeforeInstallPromptEvent;
      if (visits >= 2) setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (isIos() && visits >= 2) {
      const timer = window.setTimeout(() => {
        setIosHelp(true);
        setVisible(true);
      }, 1200);
      return () => {
        window.clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("dandle-app-install-dismissed", "1");
  };

  const install = async () => {
    if (!deferred.current) return;
    await deferred.current.prompt();
    const choice = await deferred.current.userChoice;
    if (choice.outcome === "accepted") setVisible(false);
    deferred.current = null;
  };

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-4 bottom-5 z-[80] mx-auto max-w-md rounded-2xl border border-black/10 bg-[#fffaf4]/95 p-4 shadow-2xl backdrop-blur md:left-auto md:right-6 md:mx-0">
      <button
        aria-label="Dismiss app install prompt"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1.5 text-black/50 transition hover:bg-black/5 hover:text-black"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3 pr-7">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#B85C38] text-white">
          {iosHelp ? <Share className="h-5 w-5" /> : <Download className="h-5 w-5" />}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#24211F]">Install DANDLE</p>
          <p className="mt-1 text-xs leading-5 text-[#655e59]">
            {iosHelp
              ? "Tap Share, then Add to Home Screen for an app-like DANDLE experience."
              : "Add DANDLE to your home screen for faster access and full-screen browsing."}
          </p>
          {!iosHelp && (
            <button
              onClick={install}
              className="mt-3 rounded-full bg-[#24211F] px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Install app
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
