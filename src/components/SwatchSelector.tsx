/* Prompt 2F: Swatch selector component */

import React, { useMemo, useState, useEffect } from 'react';
import { PALETTE_14, PALETTE_MAP } from '@/data/palette';
import { productSwatches } from '@/data/productSwatches';
import { getLangFromStorage } from '@/i18n/strings';

const ENABLE_IMAGE_SWAP = false; // OFF by default - feature flag

type Props = {
  productKey: string;
  onSelectionChange: (colorKey: string, colorName: string) => void;
};

export const SwatchSelector: React.FC<Props> = ({ productKey, onSelectionChange }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('ar');

  useEffect(() => {
    setLang(getLangFromStorage());
  }, []);

  const swatchKeys = productSwatches[productKey] || [];

  const colors = useMemo(() => {
    return swatchKeys
      .map((k) => PALETTE_MAP.get(k))
      .filter(Boolean) as typeof PALETTE_14;
  }, [swatchKeys]);

  const select = (key: string) => {
    setSelected(key);
    const color = PALETTE_MAP.get(key);
    const name = color ? (lang === 'ar' ? color.nameAr : color.nameEn) : key;
    onSelectionChange(key, name);
  };

  if (colors.length === 0) return null;

  return (
    <div className="flex gap-2.5 mt-3 flex-wrap" role="list" aria-label="Color swatches">
      {colors.map((c) => (
        <button
          key={c.key}
          type="button"
          className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-150 
            ${selected === c.key 
              ? 'ring-2 ring-offset-2 ring-charcoal scale-110' 
              : 'hover:scale-105'
            }`}
          style={{ 
            backgroundColor: c.hex,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)'
          }}
          aria-label={lang === 'ar' ? c.nameAr : c.nameEn}
          title={`${lang === 'ar' ? c.nameAr : c.nameEn} - ${c.material}`}
          onClick={() => select(c.key)}
          data-variant={ENABLE_IMAGE_SWAP ? `${productKey}__${c.key}` : undefined}
        />
      ))}
    </div>
  );
};

export default SwatchSelector;
