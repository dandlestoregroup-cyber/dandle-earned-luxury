import { useEffect, useState } from "react";
import { Home, MessageCircle, ShoppingBag, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";

const standaloneNow = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);

export default function AppBottomNav() {
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(display-mode: standalone)");
    const sync = () => setStandalone(standaloneNow());
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  if (!standalone) return null;

  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/complete-set", label: "Set", icon: Sparkles },
    { to: "/nour-chat", label: "Nour", icon: MessageCircle },
    { to: "/cart", label: "Cart", icon: ShoppingBag },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 bg-[#fffaf4]/95 pb-[max(env(safe-area-inset-bottom),8px)] pt-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-medium transition ${
                isActive ? "text-[#B85C38]" : "text-[#655e59]"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
