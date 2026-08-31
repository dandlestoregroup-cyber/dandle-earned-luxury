import { Home, MessageCircle, Scale, ShoppingBag, Store } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function AppBottomNav() {
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Store },
    { to: "/compare", label: "Compare", icon: Scale },
    { to: "/nour-chat", label: "Nour", icon: MessageCircle },
    { to: "/cart", label: "Cart", icon: ShoppingBag },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[70] border-t border-black/10 bg-[#fffaf4]/96 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${isActive ? "text-[#B85C38]" : "text-[#655e59]"}`
            }
          >
            <Icon className="h-[19px] w-[19px]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
