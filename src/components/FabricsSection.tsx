/* Prompt 2G: Fabrics section - language-aware */

import React, { useEffect, useState } from 'react';
import { t, getLangFromStorage, type LangKey } from '@/i18n/strings';
import { PALETTE_14 } from '@/data/palette';

export const FabricsSection: React.FC = () => {
  const [lang, setLang] = useState<LangKey>('en');

  useEffect(() => {
    const storedLang = getLangFromStorage();
    setLang(storedLang);
    
    // Listen for language changes
    const handleStorageChange = () => {
      setLang(getLangFromStorage());
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for localStorage changes within same tab
    const interval = setInterval(() => {
      const currentLang = getLangFromStorage();
      setLang(prev => prev !== currentLang ? currentLang : prev);
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const isArabic = lang === 'ar';

  return (
    <section className="py-12 md:py-16 px-5 bg-gradient-to-b from-warm-beige via-warm-beige to-bronze/30" aria-labelledby="fabrics-title">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Text Content */}
        <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
          <h2 id="fabrics-title" className="font-headline text-2xl md:text-3xl text-charcoal">
            {t('fabrics.title', lang)}
          </h2>
          <p className="text-base text-charcoal/80 font-body leading-relaxed">
            {t('fabrics.intro', lang)}
          </p>


          {!isArabic && (
            <p className="text-base font-body leading-relaxed text-charcoal/90 mt-4">
              Every fabric is selected for durability, comfort, and timeless appeal — crafted to last.
            </p>
          )}
        </div>

        {/* Premium Swatch Display - Horizontal scroll on mobile */}
        <div className="space-y-4">
          <h3 className="font-headline text-lg text-charcoal/80">
            {isArabic ? 'ألوانـنا المميزة' : 'Our Signature Colors'}
          </h3>
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {PALETTE_14.map((color) => (
              <div key={color.key} className="group relative flex flex-col items-center">
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer border border-charcoal/10"
                  style={{ backgroundColor: color.hex }}
                  title={isArabic ? color.nameAr : color.nameEn}
                />
                <span className="text-[10px] md:text-xs text-charcoal/60 mt-1 text-center line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isArabic ? color.nameAr : color.nameEn}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FabricsSection;
