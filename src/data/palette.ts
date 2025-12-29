/* Prompt 2F: 14-color fabric palette from uploaded reference image */

export type PaletteEntry = {
  key: string;
  nameEn: string;
  nameAr: string;
  hex: string;
  material: string;
};

// Core Collection - Timeless Sophistication
// Cairo Trends - Modern Elegance
export const PALETTE_14: PaletteEntry[] = [
  // Core Collection
  { key: 'nile-sapphire', nameEn: 'Nile Sapphire Blue', nameAr: 'أزرق النيل الياقوتي', hex: '#2E5D7B', material: 'Velvet' },
  { key: 'alexandria-linen', nameEn: 'Alexandria Linen', nameAr: 'كتان الإسكندرية', hex: '#C4A77D', material: 'Belgian Linen' },
  { key: 'desert-sage', nameEn: 'Desert Sage', nameAr: 'المريمية الصحراوية', hex: '#8B9A6B', material: 'Microsuede' },
  { key: 'desert-grey', nameEn: 'Desert Grey', nameAr: 'الرمادي الصحراوي', hex: '#5C5C5C', material: 'Leather' },
  { key: 'amber-sand', nameEn: 'Amber Sand', nameAr: 'رمل العنبر', hex: '#C19A6B', material: 'Nubuck Leather' },
  { key: 'mocha-taupe', nameEn: 'Mocha Taupe', nameAr: 'موكا تاوب', hex: '#6B5B4D', material: 'Chenille' },
  { key: 'coastal-fog', nameEn: 'Coastal Fog Grey', nameAr: 'رمادي ضباب الساحل', hex: '#8A8D8F', material: 'Chenille' },
  
  // Cairo Trends
  { key: 'nile-mist', nameEn: 'Nile Mist Terracotta', nameAr: 'تيراكوتا ضباب النيل', hex: '#C67B5C', material: 'Cotton Velvet' },
  { key: 'giza-gold', nameEn: 'Giza Gold Weave', nameAr: 'ذهب الجيزة المنسوج', hex: '#B8860B', material: 'Woven Fabric' },
  { key: 'oasis-green', nameEn: 'Oasis Green', nameAr: 'أخضر الواحة', hex: '#4A7C59', material: 'Performance Fabric' },
  { key: 'blue-nile-denim', nameEn: 'Blue Nile Denim', nameAr: 'دنيم النيل الأزرق', hex: '#4A6B8A', material: 'Recycled Denim' },
  { key: 'sandstorm-ochre', nameEn: 'Sandstorm Ochre', nameAr: 'مغرة العاصفة الرملية', hex: '#CC7722', material: 'Cotton Blend' },
  { key: 'papyrus-stripe', nameEn: 'Papyrus Stripe', nameAr: 'شريط البردي', hex: '#E8DCC4', material: 'Linen Blend' },
  { key: 'clay-pottery', nameEn: 'Clay Pottery', nameAr: 'فخار الطين', hex: '#8B4513', material: 'Textured Woven' },
];

// Lookup by key
export const PALETTE_MAP = new Map(PALETTE_14.map((c) => [c.key, c]));
