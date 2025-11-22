import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InstalmentToggleProps {
  price: number;
}

type Provider = "valu" | "sympl";

export const InstalmentToggle = ({ price }: InstalmentToggleProps) => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState<Provider>("valu");
  const [tenure, setTenure] = useState(12);
  const [loading, setLoading] = useState(false);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const tenureOptions = [3, 6, 9, 12, 18, 24];

  const calculateInstalment = async (selectedProvider: Provider, selectedTenure: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(`${selectedProvider}-calc`, {
        body: { price, tenure: selectedTenure }
      });

      if (error) throw error;
      setMonthlyPayment(data.monthly);
    } catch (error) {
      console.error("Error calculating instalment:", error);
      setMonthlyPayment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    calculateInstalment(newProvider, tenure);
  };

  const handleTenureChange = (newTenure: number) => {
    setTenure(newTenure);
    calculateInstalment(provider, newTenure);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => handleProviderChange("valu")}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            provider === "valu"
              ? "bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-background shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          valU
        </button>
        <button
          onClick={() => handleProviderChange("sympl")}
          className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            provider === "sympl"
              ? "bg-gradient-to-r from-[#1a1a1a] to-[#333333] text-white shadow-lg"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          Sympl
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tenureOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleTenureChange(option)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              tenure === option
                ? "bg-accent text-accent-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {option}m
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-accent" />
        </div>
      ) : monthlyPayment ? (
        <div className="text-center py-2">
          <p className="text-sm text-muted-foreground">{t('product.instalments')}</p>
          <p className="text-2xl font-bold text-accent">
            {monthlyPayment.toLocaleString('en-US')} EGP
            <span className="text-sm font-normal text-muted-foreground ml-1">
              {t('product.perMonth')}
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
};
