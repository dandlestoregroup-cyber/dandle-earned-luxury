import { Shield, CreditCard, Wallet, Banknote, Lock } from "lucide-react";

export const EgyptianTrustBar = () => {
  const paymentMethods = [
    { name: "Fawry", icon: Wallet },
    { name: "Meeza", icon: CreditCard },
    { name: "COD", icon: Banknote },
    { name: "NBE", icon: CreditCard },
    { name: "Secure", icon: Lock }
  ];

  return (
    <div className="bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border border-accent/20 rounded-lg p-3">
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.name}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background/80 rounded-full border border-accent/10"
            >
              <Icon className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-foreground">
                {method.name}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-center text-xs text-muted-foreground mt-2">
        دفع آمن بجميع الطرق المصرية • Secure Egyptian Payment Methods
      </p>
    </div>
  );
};
