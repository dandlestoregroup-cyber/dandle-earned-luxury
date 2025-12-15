import { Truck, Shield, Wrench, Lock } from "lucide-react";

export const TrustBadges = () => {
  const badges = [
    { icon: Truck, text: "Free Delivery & Assembly" },
    { icon: Shield, text: "2-Year Warranty" },
    { icon: Wrench, text: "Handcrafted in Egypt" },
    { icon: Lock, text: "Secure Payment" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 py-4">
      {badges.map((badge, index) => (
        <div 
          key={index}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <badge.icon className="w-4 h-4 text-bronze flex-shrink-0" />
          <span className="font-body">{badge.text}</span>
        </div>
      ))}
    </div>
  );
};
