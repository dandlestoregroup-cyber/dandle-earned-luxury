/**
 * DANDLE Complete Site Image Manifest v2.0
 * 
 * All 34 images needed for complete website with permanent reference URLs
 * Aligned with Dandle Visual Identity System v1.0
 */

export type ImageCategory = 
  | 'product-hero'      // 1024x1024 - product cards
  | 'product-gallery'   // 2752x1536 - product page carousel
  | 'lifestyle-home'    // 2752x1536 - home settings
  | 'lifestyle-hotel'   // 2752x1536 - hotel/hospitality
  | 'lifestyle-office'  // 2752x1536 - office/work settings
  | 'gift-campaign'     // 2752x1536 - Gift of Comfort campaign
  | 'detail-macro';     // 2752x1536 or 3:2 - close-up details

export type ImageStatus = 'exists' | 'missing' | 'generating' | 'error';

export interface SiteImage {
  id: string;
  filename: string;
  category: ImageCategory;
  product: string;
  productHandle: string;
  setting: string;
  referenceUrl: string;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  prompt: string;
  status: ImageStatus;
  generatedUrl?: string;
  captionEn?: string;
  captionAr?: string;
  subtitleEn?: string;
  subtitleAr?: string;
}

// Base URL for all reference images
const BASE_URL = 'https://dandle-earned-luxury.lovable.app';

// Brand identity constraints embedded in all prompts
const BRAND_CONSTRAINTS = `
MANDATORY RULES:
- L-brackets: Dandle Orange #E67E22, 8px stroke, 55px length, 40px inset, all 4 corners
- Colors: Deep Brown #3E2723, Dandle Orange #E67E22, Off White #FAF7F2, Warm Cream #F5E6D3
- 40-50% negative space mandatory
- ONE prop maximum (coffee, book, or reading light)
- Chair = 60% of frame, magnetic center
- 45° LEFT camera angle (hides controls on right armrest)
- Real photography feel - no AI sheen, warm natural light
- Human subjects: Egyptian woman 35-65, flowing uncovered hair, natural skin texture
- NO veil/hijab, NO plastic skin, NO looking at camera
`.trim();

export const siteImageManifest: SiteImage[] = [
  // ============ PRODUCT HERO IMAGES (8) - 1024x1024 ============
  {
    id: 'hero-diva',
    filename: 'diva_desert-sage_hero_product-card.webp',
    category: 'product-hero',
    product: 'Diva',
    productHandle: 'diva',
    setting: 'Studio white background',
    referenceUrl: `${BASE_URL}/images/dandle-diva.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Desert Sage microsuede Diva recliner, studio white background, 45° LEFT angle, controls hidden in shadow, clean product shot. Chair is hero, sharp focus on fabric texture. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'hero-comfortplus',
    filename: 'comfortplus_mocha-taupe_hero_product-card.webp',
    category: 'product-hero',
    product: 'ComfortPlus',
    productHandle: 'comfortplus',
    setting: 'Studio white background',
    referenceUrl: `${BASE_URL}/images/dandle-comfortplus.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Mocha Taupe chenille ComfortPlus recliner, thick plush cushioning, white background, 45° LEFT angle, controls hidden. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'hero-worknest',
    filename: 'worknest_oasis-green_hero_product-card.webp',
    category: 'product-hero',
    product: 'WorkNest',
    productHandle: 'worknest',
    setting: 'Studio with laptop tray',
    referenceUrl: `${BASE_URL}/images/dandle-worknest.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Oasis Green WorkNest recliner, laptop tray visible and attached, white background, 45° LEFT angle, productivity-focused. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'hero-relaxmax',
    filename: 'relaxmax_offwhite_hero_product-card.webp',
    category: 'product-hero',
    product: 'RelaxMax',
    productHandle: 'relaxmax',
    setting: 'Studio white background',
    referenceUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Off-white RelaxMax flagship recliner, premium leather texture, white background, 45° LEFT angle, controls hidden. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
  },
  {
    id: 'hero-easyup-standard',
    filename: 'easyup-standard_mocha-taupe_hero_product-card.webp',
    category: 'product-hero',
    product: 'EasyUp Standard',
    productHandle: 'easyup-standard',
    setting: 'Studio with lift base visible',
    referenceUrl: `${BASE_URL}/images/dandle-easyup-standard.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Mocha Taupe EasyUp Standard lift recliner, lift base mechanism visible, white background, 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'hero-easyup-compact',
    filename: 'easyup-compact_coastal-fog_hero_product-card.webp',
    category: 'product-hero',
    product: 'EasyUp Compact',
    productHandle: 'easyup-compact',
    setting: 'Studio compact footprint',
    referenceUrl: `${BASE_URL}/images/dandle-easyup-compact.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Coastal Fog grey EasyUp Compact recliner, compact footprint emphasized, white background, 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/easyup-compact-grey-front.webp`,
  },
  {
    id: 'hero-cozycompanion',
    filename: 'cozycompanion_amber-sand_hero_product-card.webp',
    category: 'product-hero',
    product: 'CozyCompanion',
    productHandle: 'cozycompanion',
    setting: 'Studio loveseat scale',
    referenceUrl: `${BASE_URL}/images/cozycompanion-beige-front.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Amber Sand CozyCompanion loveseat recliner, two-seater scale emphasized, white background, 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/cozycompanion-beige-front.jpg`,
  },
  {
    id: 'hero-spacesaver',
    filename: 'spacesaver_giza-gold_hero_product-card.webp',
    category: 'product-hero',
    product: 'SpaceSaver',
    productHandle: 'spacesaver',
    setting: 'Studio wall-hugger design',
    referenceUrl: `${BASE_URL}/images/dandle-spacesaver.jpg`,
    dimensions: { width: 1024, height: 1024 },
    aspectRatio: '1:1',
    prompt: `Giza Gold SpaceSaver wall-hugger recliner, compact wall-hugging design visible, white background, 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/spacesaver-red-front.webp`,
  },

  // ============ PRODUCT GALLERY IMAGES (8) - 2752x1536 ============
  {
    id: 'gallery-diva-front',
    filename: 'diva_giza-gold_gallery_front-view.webp',
    category: 'product-gallery',
    product: 'Diva',
    productHandle: 'diva',
    setting: 'Studio front view',
    referenceUrl: `${BASE_URL}/images/dandle-diva.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Giza Gold woven fabric Diva recliner, EMPTY chair, 30° LEFT angle, white background, gold thread shimmer visible in fabric. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'gallery-comfortplus-reclined',
    filename: 'comfortplus_mocha-taupe_gallery_reclined.webp',
    category: 'product-gallery',
    product: 'ComfortPlus',
    productHandle: 'comfortplus',
    setting: 'Full recline demonstration',
    referenceUrl: `${BASE_URL}/images/dandle-comfortplus.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Mocha Taupe ComfortPlus EMPTY, full recline position, footrest fully extended, 45° side view, white background. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'gallery-worknest-tray',
    filename: 'worknest_coastal-fog_gallery_laptop-tray.webp',
    category: 'product-gallery',
    product: 'WorkNest',
    productHandle: 'worknest',
    setting: 'Laptop tray detail',
    referenceUrl: `${BASE_URL}/images/dandle-worknest.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Coastal Fog WorkNest EMPTY, laptop tray attached and extended, brushed metal cupholder visible, 30° LEFT angle, white background. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'gallery-relaxmax-studio',
    filename: 'relaxmax_desert-sage_gallery_studio.webp',
    category: 'product-gallery',
    product: 'RelaxMax',
    productHandle: 'relaxmax',
    setting: 'Studio Desert Sage',
    referenceUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Desert Sage RelaxMax EMPTY, 30° LEFT angle, white background, premium fabric texture visible. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'gallery-easyup-lifted',
    filename: 'easyup-standard_gallery_lifted-demo.webp',
    category: 'product-gallery',
    product: 'EasyUp Standard',
    productHandle: 'easyup-standard',
    setting: 'Lift mechanism demonstration',
    referenceUrl: `${BASE_URL}/images/dandle-easyup-standard.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Mocha Taupe EasyUp Standard EMPTY, lifted position at 45° angle, lift mechanism and base visible, side view, white background. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'gallery-easyup-compact-lifted',
    filename: 'easyup-compact_gallery_lifted-demo.webp',
    category: 'product-gallery',
    product: 'EasyUp Compact',
    productHandle: 'easyup-compact',
    setting: 'Compact lift demonstration',
    referenceUrl: `${BASE_URL}/images/dandle-easyup-compact.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Desert Grey EasyUp Compact EMPTY, lifted position, compact mechanism visible, side angle, white background. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/easyup-beige-lifted.jpg`,
  },
  {
    id: 'gallery-cozycompanion-front',
    filename: 'cozycompanion_amber-sand_gallery_front-view.webp',
    category: 'product-gallery',
    product: 'CozyCompanion',
    productHandle: 'cozycompanion',
    setting: 'Loveseat front view',
    referenceUrl: `${BASE_URL}/images/cozycompanion-beige-front.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Amber Sand CozyCompanion loveseat EMPTY, 30° LEFT angle, white background, two-seater scale emphasized. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/cozycompanion-beige-front.jpg`,
  },
  {
    id: 'gallery-spacesaver-side',
    filename: 'spacesaver_sandstorm-ochre_gallery_side-profile.webp',
    category: 'product-gallery',
    product: 'SpaceSaver',
    productHandle: 'spacesaver',
    setting: 'Wall-hugger profile',
    referenceUrl: `${BASE_URL}/images/dandle-spacesaver.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Sandstorm Ochre SpaceSaver EMPTY, side LEFT profile, white background, wall-hugging design clearly visible. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },

  // ============ LIFESTYLE: HOME (4) - 2752x1536 ============
  {
    id: 'lifestyle-home-zamalek',
    filename: 'relaxmax_lifestyle_zamalek-living.webp',
    category: 'lifestyle-home',
    product: 'RelaxMax',
    productHandle: 'relaxmax',
    setting: 'Zamalek apartment living room',
    referenceUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Off-white RelaxMax 60% of frame. Egyptian woman (46, bob haircut, flowing dark hair, NO VEIL, beige cashmere knit, thin gold bracelet) curled with book, absorbed reader posture. Zamalek apartment: herringbone parquet, French windows, Nile trees visible, brass reading lamp, single coffee cup. 45° LEFT angle, low camera. Golden hour warm light. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'At Home',
    captionAr: 'في المنزل',
    subtitleEn: 'Where comfort meets family',
    subtitleAr: 'حيث تلتقي الراحة بالعائلة',
  },
  {
    id: 'lifestyle-home-newgiza',
    filename: 'comfortplus_lifestyle_newgiza-villa.webp',
    category: 'lifestyle-home',
    product: 'ComfortPlus',
    productHandle: 'comfortplus',
    setting: 'New Giza villa',
    referenceUrl: `${BASE_URL}/images/dandle-comfortplus.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Mocha Taupe ComfortPlus 60% of frame. Egyptian woman (52, salon waves, flowing dark hair, NO VEIL, camel loungewear, gold necklace) full recline, eyes closed, ceramic mug, exhale posture. New Giza villa: travertine floors, floor-to-ceiling glass doors, palm garden visible, abstract gold art. 45° LEFT angle, low camera. Golden hour. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Villa Living',
    captionAr: 'حياة الفيلا',
    subtitleEn: 'Refined daily comfort',
    subtitleAr: 'راحة يومية راقية',
  },
  {
    id: 'lifestyle-home-reading',
    filename: 'diva_lifestyle_reading-nook.webp',
    category: 'lifestyle-home',
    product: 'Diva',
    productHandle: 'diva',
    setting: 'Reading nook',
    referenceUrl: `${BASE_URL}/images/dandle-diva.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Desert Sage Diva 60% of frame. Egyptian woman (42, flowing dark hair, NO VEIL, cream linen blouse, reading glasses on) absorbed in leather-bound book, natural posture. Cozy reading nook: floor-to-ceiling bookshelf, parquet floor, single brass lamp, tea on side table. 45° LEFT angle. Warm afternoon light through sheer curtains. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/lifestyle-reading-nook.jpg`,
    captionEn: 'Reading Nook',
    captionAr: 'ركن القراءة',
    subtitleEn: 'Your private sanctuary',
    subtitleAr: 'ملاذك الخاص',
  },
  {
    id: 'lifestyle-home-family',
    filename: 'cozycompanion_lifestyle_family-moment.webp',
    category: 'lifestyle-home',
    product: 'CozyCompanion',
    productHandle: 'cozycompanion',
    setting: 'Family moment',
    referenceUrl: `${BASE_URL}/images/cozycompanion-beige-front.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Mocha Taupe CozyCompanion loveseat 55% of frame. Mother (58, grey hair, NO VEIL, cream cardigan) seated, daughter (32, dark waves, NO VEIL, white blouse) perched on armrest, both smiling warmly at each other. Zamalek apartment: parquet floor, family photos on wall, warm ambient lighting. 45° LEFT angle. Gift-giving atmosphere. ${BRAND_CONSTRAINTS}`,
    status: 'exists',
    generatedUrl: `${BASE_URL}/images/cozycompanion-couple-lifestyle.jpg`,
    captionEn: 'Family Moments',
    captionAr: 'لحظات عائلية',
    subtitleEn: 'Shared comfort, lasting memories',
    subtitleAr: 'راحة مشتركة، ذكريات دائمة',
  },

  // ============ LIFESTYLE: HOTEL (3) - 2752x1536 ============
  {
    id: 'lifestyle-hotel-suite',
    filename: 'relaxmax_lifestyle_hotel-suite.webp',
    category: 'lifestyle-hotel',
    product: 'RelaxMax',
    productHandle: 'relaxmax',
    setting: 'Boutique hotel suite',
    referenceUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Off-white RelaxMax 60% of frame in boutique hotel suite. EMPTY chair. Gouna resort style: floor-to-ceiling windows with Red Sea view, neutral linen bedding visible in background, travertine floors, brass accents, single orchid. 45° LEFT angle. Soft morning light. Premium hospitality setting. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Boutique Hotel',
    captionAr: 'فندق بوتيك',
    subtitleEn: 'Premium hospitality comfort',
    subtitleAr: 'راحة ضيافة فاخرة',
  },
  {
    id: 'lifestyle-hotel-vacation',
    filename: 'diva_lifestyle_vacation-rental.webp',
    category: 'lifestyle-hotel',
    product: 'Diva',
    productHandle: 'diva',
    setting: 'Vacation rental',
    referenceUrl: `${BASE_URL}/images/dandle-diva.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Giza Gold Diva 60% of frame in refined vacation rental. EMPTY chair. Sahel beach house: whitewashed walls, natural fiber rug, Mediterranean blue accents, terrace with sea glimpse, rattan decor. 45° LEFT angle. Golden hour light. Elevated guest experience. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Vacation Rental',
    captionAr: 'إيجار العطلات',
    subtitleEn: 'Elevate guest experiences',
    subtitleAr: 'ارتقِ بتجارب الضيوف',
  },
  {
    id: 'lifestyle-hotel-lobby',
    filename: 'spacesaver_lifestyle_hotel-lobby.webp',
    category: 'lifestyle-hotel',
    product: 'SpaceSaver',
    productHandle: 'spacesaver',
    setting: 'Hotel lobby corner',
    referenceUrl: `${BASE_URL}/images/dandle-spacesaver.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Alexandria Linen SpaceSaver 55% of frame in hotel lobby corner. EMPTY chair. Cairo hotel: marble floors, brass details, subtle art deco elements, single palm plant, ambient evening lighting, wall-hugging placement emphasized. 45° LEFT angle. Compact elegance. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Hotel Lobby',
    captionAr: 'بهو الفندق',
    subtitleEn: 'Compact elegance',
    subtitleAr: 'أناقة مدمجة',
  },

  // ============ LIFESTYLE: OFFICE (3) - 2752x1536 ============
  {
    id: 'lifestyle-office-executive',
    filename: 'worknest_lifestyle_ceo-suite.webp',
    category: 'lifestyle-office',
    product: 'WorkNest',
    productHandle: 'worknest',
    setting: 'CEO executive suite',
    referenceUrl: `${BASE_URL}/images/dandle-worknest.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Nile Sapphire WorkNest 60% of frame. Egyptian executive woman (48, professional blowout, flowing dark hair, NO VEIL, navy blazer, thin gold watch) reviewing documents on laptop tray, focused. CEO office: floor-to-ceiling windows with Cairo skyline, dark wood paneling, glass desk, single pendant light, 4000K professional lighting. 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Executive Suite',
    captionAr: 'جناح تنفيذي',
    subtitleEn: 'Where decisions are made',
    subtitleAr: 'حيث تُصنع القرارات',
  },
  {
    id: 'lifestyle-office-sodic',
    filename: 'worknest_lifestyle_sodic-office.webp',
    category: 'lifestyle-office',
    product: 'WorkNest',
    productHandle: 'worknest',
    setting: 'Modern SODIC office',
    referenceUrl: `${BASE_URL}/images/dandle-worknest.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Blue Nile Denim WorkNest 60% of frame. Egyptian professional woman (40, ponytail, flowing dark hair, NO VEIL, grey blazer, minimal jewelry) working on MacBook on laptop tray, focused but relaxed. SODIC office: walnut accent wall, polished concrete floor, oak standing desk nearby, single pendant light, 3000K warm professional lighting. 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Modern Office',
    captionAr: 'مكتب عصري',
    subtitleEn: 'Productivity meets comfort',
    subtitleAr: 'الإنتاجية تلتقي بالراحة',
  },
  {
    id: 'lifestyle-office-reception',
    filename: 'easyup-standard_lifestyle_reception.webp',
    category: 'lifestyle-office',
    product: 'EasyUp Standard',
    productHandle: 'easyup-standard',
    setting: 'Professional reception area',
    referenceUrl: `${BASE_URL}/images/dandle-easyup-standard.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Mocha Taupe EasyUp Standard 55% of frame in professional reception. EMPTY chair. Medical/professional waiting area: clean white walls, single green plant, warm wood accents, neutral carpet, professional lighting. 45° LEFT angle. Accessible comfort for all visitors. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Reception Area',
    captionAr: 'منطقة الاستقبال',
    subtitleEn: 'Comfort for every visitor',
    subtitleAr: 'راحة لكل زائر',
  },

  // ============ GIFT OF COMFORT CAMPAIGN (4) - 2752x1536 ============
  {
    id: 'gift-hero',
    filename: 'gift_hero_relaxmax.webp',
    category: 'gift-campaign',
    product: 'RelaxMax',
    productHandle: 'relaxmax',
    setting: 'Gift of Comfort hero',
    referenceUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Off-white RelaxMax 55% of frame. Gift-wrapped presentation scene. Chair with elegant cream ribbon bow, warm ambient lighting, Off White #FAF7F2 background with subtle Warm Cream #F5E6D3 gradient. Single gift tag visible. Premium presentation atmosphere. "GIFT OF COMFORT" campaign aesthetic. 45° LEFT angle. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'Gift of Comfort',
    captionAr: 'هدية الراحة',
    subtitleEn: 'The ultimate expression of care',
    subtitleAr: 'أسمى تعبير عن الاهتمام',
  },
  {
    id: 'gift-giving-moment',
    filename: 'gift_cozycompanion_giving-moment.webp',
    category: 'gift-campaign',
    product: 'CozyCompanion',
    productHandle: 'cozycompanion',
    setting: 'Gift giving moment',
    referenceUrl: `${BASE_URL}/images/cozycompanion-beige-front.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Amber Sand CozyCompanion loveseat 50% of frame. Adult daughter (35, flowing dark hair, NO VEIL, elegant cream dress) presenting chair to mother (60, grey hair, NO VEIL, soft beige cardigan), mother's hand on heart in gratitude. Zamalek living room: warm lighting, family photos visible, gift tag on chair. Emotional gift-giving moment. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'The Perfect Gift',
    captionAr: 'الهدية المثالية',
    subtitleEn: 'For those who deserve the finest',
    subtitleAr: 'لمن يستحقون الأفضل',
  },
  {
    id: 'gift-unboxing',
    filename: 'gift_diva_unboxing.webp',
    category: 'gift-campaign',
    product: 'Diva',
    productHandle: 'diva',
    setting: 'Premium unboxing',
    referenceUrl: `${BASE_URL}/images/dandle-diva.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Desert Sage Diva 55% of frame being revealed. Premium unboxing scene: protective covering being removed, Dandle branded packaging visible, white-glove delivery person's hands in frame (white cotton gloves only, no face). New Giza villa entry: travertine floor, natural light from doorway. First impression magic. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'White-Glove Delivery',
    captionAr: 'توصيل راقي',
    subtitleEn: 'Premium from first touch',
    subtitleAr: 'فخامة من اللمسة الأولى',
  },
  {
    id: 'gift-2026-campaign',
    filename: 'gift_relaxmax_2026-campaign.webp',
    category: 'gift-campaign',
    product: 'RelaxMax',
    productHandle: 'relaxmax',
    setting: '2026 New Year campaign',
    referenceUrl: `${BASE_URL}/images/relaxmax-hero-offwhite.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Giza Gold RelaxMax 60% of frame. Egyptian woman (48, elegant updo, flowing dark hair, NO VEIL, champagne silk blouse, pearl earrings) in gratitude posture, eyes closed, hand on heart. Zamalek apartment: subtle New Year decoration (single orchid, elegant candle), French windows with evening city lights. "Make 2026 Your Most Relaxing Year" campaign. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
    captionEn: 'New Year, New Comfort',
    captionAr: 'عام جديد، راحة جديدة',
    subtitleEn: 'Make 2026 your most relaxing year',
    subtitleAr: 'اجعل 2026 عامك الأكثر راحة',
  },

  // ============ DETAIL/MACRO SHOTS (4) - 2752x1536 ============
  {
    id: 'detail-velvet-stitching',
    filename: 'detail_diva_velvet-stitching.webp',
    category: 'detail-macro',
    product: 'Diva',
    productHandle: 'diva',
    setting: 'Velvet stitching macro',
    referenceUrl: `${BASE_URL}/images/dandle-diva.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Extreme macro: Nile Sapphire velvet headrest of Diva recliner, double-stitch seams visible, fabric texture at 100% detail, shallow depth of field creating bokeh. Natural light revealing fabric sheen. Craftsmanship detail. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'detail-massage-mechanism',
    filename: 'detail_comfortplus_massage.webp',
    category: 'detail-macro',
    product: 'ComfortPlus',
    productHandle: 'comfortplus',
    setting: 'Massage mechanism detail',
    referenceUrl: `${BASE_URL}/images/dandle-comfortplus.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Macro: Coastal Fog grey chenille backrest of ComfortPlus, subtle fabric ripple from hidden massage rollers beneath, plush cushion depth visible. Natural light, shallow focus. Technology meets comfort. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'detail-laptop-tray',
    filename: 'detail_worknest_laptop-tray.webp',
    category: 'detail-macro',
    product: 'WorkNest',
    productHandle: 'worknest',
    setting: 'Laptop tray and cupholder',
    referenceUrl: `${BASE_URL}/images/dandle-worknest.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Macro: Brushed metal laptop tray of WorkNest, MacBook Air on surface, steel cupholder with ceramic mug, grain of metal visible. Natural light, shallow depth of field. Productivity details. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
  {
    id: 'detail-lift-base',
    filename: 'detail_easyup_lift-base.webp',
    category: 'detail-macro',
    product: 'EasyUp Standard',
    productHandle: 'easyup-standard',
    setting: 'Lift mechanism base',
    referenceUrl: `${BASE_URL}/images/dandle-easyup-standard.jpg`,
    dimensions: { width: 2752, height: 1536 },
    aspectRatio: '16:9',
    prompt: `Macro: Lift mechanism base of EasyUp Standard, metal framework and hydraulic system visible, precision engineering. Clean studio lighting, shallow focus on mechanical details. Accessibility technology. ${BRAND_CONSTRAINTS}`,
    status: 'missing',
  },
];

// Helper functions
export const getImagesByCategory = (category: ImageCategory): SiteImage[] => 
  siteImageManifest.filter(img => img.category === category);

export const getImagesByProduct = (productHandle: string): SiteImage[] => 
  siteImageManifest.filter(img => img.productHandle === productHandle);

export const getExistingImages = (): SiteImage[] => 
  siteImageManifest.filter(img => img.status === 'exists');

export const getMissingImages = (): SiteImage[] => 
  siteImageManifest.filter(img => img.status === 'missing');

export const getLifestyleImages = (): SiteImage[] => 
  siteImageManifest.filter(img => 
    img.category === 'lifestyle-home' || 
    img.category === 'lifestyle-hotel' || 
    img.category === 'lifestyle-office'
  );

export const getGiftCampaignImages = (): SiteImage[] => 
  siteImageManifest.filter(img => img.category === 'gift-campaign');

// Stats
export const manifestStats = {
  total: siteImageManifest.length,
  existing: siteImageManifest.filter(img => img.status === 'exists').length,
  missing: siteImageManifest.filter(img => img.status === 'missing').length,
  byCategory: {
    'product-hero': siteImageManifest.filter(img => img.category === 'product-hero').length,
    'product-gallery': siteImageManifest.filter(img => img.category === 'product-gallery').length,
    'lifestyle-home': siteImageManifest.filter(img => img.category === 'lifestyle-home').length,
    'lifestyle-hotel': siteImageManifest.filter(img => img.category === 'lifestyle-hotel').length,
    'lifestyle-office': siteImageManifest.filter(img => img.category === 'lifestyle-office').length,
    'gift-campaign': siteImageManifest.filter(img => img.category === 'gift-campaign').length,
    'detail-macro': siteImageManifest.filter(img => img.category === 'detail-macro').length,
  },
};
