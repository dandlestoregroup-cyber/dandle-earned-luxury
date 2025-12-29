/* Prompt 2G: Fabrics section with exact Arabic text */

import React, { useEffect, useState } from 'react';
import { t, getLangFromStorage, type LangKey } from '@/i18n/strings';
import { PALETTE_14 } from '@/data/palette';

export const FabricsSection: React.FC = () => {
  const [lang, setLang] = useState<LangKey>('ar');

  useEffect(() => {
    setLang(getLangFromStorage());
  }, []);

  return (
    <section className="py-16 px-5 bg-gradient-to-b from-warm-beige to-charcoal" aria-labelledby="fabrics-title">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Text Content */}
        <div className="space-y-4">
          <h2 id="fabrics-title" className="font-headline text-3xl md:text-4xl text-charcoal">
            {t('fabrics.title', lang)}
          </h2>
          <p className="text-lg text-charcoal/80 font-body leading-relaxed">
            {t('fabrics.intro', lang)}
          </p>

          {lang === 'ar' && (
            <p className="text-lg font-body leading-loose text-charcoal/90 whitespace-pre-line text-right mt-6" dir="rtl">
              {t('fabrics.paragraph_ar_verbatim', lang)}
            </p>
          )}

          {/* Color Swatches Display */}
          <div className="flex flex-wrap gap-3 mt-8">
            {PALETTE_14.map((color) => (
              <div key={color.key} className="group relative">
                <div
                  className="w-10 h-10 rounded-full shadow-md transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex }}
                  title={lang === 'ar' ? color.nameAr : color.nameEn}
                />
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal text-warm-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {lang === 'ar' ? color.nameAr : color.nameEn}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="flex flex-col gap-5">
          <img
            src="/images/fabrics/palette.jpg"
            alt="Dandle Color Palette"
            loading="lazy"
            className="w-full h-auto rounded-2xl shadow-luxury"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <img
            src="/images/fabrics/partner.jpg"
            alt="Fabric Partner"
            loading="lazy"
            className="w-full h-auto rounded-2xl shadow-luxury"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>
    </section>
  );
};

export default FabricsSection;
