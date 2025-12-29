/* Premium swatch selector with elegant tooltip display */

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
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

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

  const selectedColor = selected ? PALETTE_MAP.get(selected) : null;
  const hoveredColor = hoveredKey ? PALETTE_MAP.get(hoveredKey) : null;
  const displayColor = hoveredColor || selectedColor;

  return (
    <div className="space-y-3">
      {/* Selected color name display */}
      <div className="h-6 flex items-center">
        {displayColor && (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border border-charcoal/20"
              style={{ backgroundColor: displayColor.hex }}
            />
            <span className="font-body text-sm text-charcoal">
              {lang === 'ar' ? displayColor.nameAr : displayColor.nameEn}
            </span>
            {displayColor.material && (
              <span className="text-xs text-charcoal/50">• {displayColor.material}</span>
            )}
          </div>
        )}
        {!displayColor && (
          <span className="font-body text-sm text-charcoal/50">
            {lang === 'ar' ? 'اختر اللون' : 'Select a color'}
          </span>
        )}
      </div>

      {/* Premium inline swatch row */}
      <div className="flex gap-1.5 flex-wrap" role="listbox" aria-label="Color swatches">
        {colors.map((c) => (
          <button
            key={c.key}
            type="button"
            role="option"
            aria-selected={selected === c.key}
            className={`relative w-7 h-7 md:w-8 md:h-8 rounded-full cursor-pointer transition-all duration-200 
              ${selected === c.key 
                ? 'ring-2 ring-offset-1 ring-dandle-orange scale-105' 
                : 'hover:scale-110 hover:ring-1 hover:ring-charcoal/30'
              }`}
            style={{ 
              backgroundColor: c.hex,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.2)'
            }}
            onClick={() => select(c.key)}
            onMouseEnter={() => setHoveredKey(c.key)}
            onMouseLeave={() => setHoveredKey(null)}
            data-variant={ENABLE_IMAGE_SWAP ? `${productKey}__${c.key}` : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default SwatchSelector;
