// Premium Fabric & Color Collections for Dandle Chairs
// Hex codes match the Brand Bible specifications

export interface FabricColor {
  id: string;
  name: string;
  nameAr: string; // Arabic transliteration (NOT translation)
  fabric: string;
  fabricAr: string; // Arabic fabric name
  collection: 'core' | 'cairo';
  hexColor: string;
  gradientColors?: string[]; // For texture simulation
  pattern?: 'solid' | 'textured' | 'striped' | 'woven';
  premium?: boolean;
}

export interface FabricCollection {
  id: string;
  name: string;
  nameAr: string;
  tagline: string;
  taglineAr: string;
  colors: FabricColor[];
}

// Core Collection - Timeless Sophistication (7 Colors)
export const coreCollection: FabricColor[] = [
  {
    id: 'nile-sapphire-blue',
    name: 'Nile Sapphire Blue',
    nameAr: 'نايل سافاير بلو',
    fabric: 'Velvet',
    fabricAr: 'مخمل',
    collection: 'core',
    hexColor: '#1e3a5f', // Updated to match Brand Bible
    gradientColors: ['#1e3a5f', '#2a4d75', '#162d4a'],
    pattern: 'solid',
    premium: true,
  },
  {
    id: 'alexandria-linen',
    name: 'Alexandria Linen',
    nameAr: 'ألكساندريا لينين',
    fabric: 'Belgian Linen',
    fabricAr: 'كتان بلجيكي',
    collection: 'core',
    hexColor: '#e8e4d9', // Updated to match Brand Bible
    gradientColors: ['#e8e4d9', '#f0ece3', '#ddd8cc'],
    pattern: 'textured',
  },
  {
    id: 'desert-sage',
    name: 'Desert Sage',
    nameAr: 'ديزرت سيج',
    fabric: 'Microsuede',
    fabricAr: 'ميكروسويد',
    collection: 'core',
    hexColor: '#a4a896', // Updated to match Brand Bible
    gradientColors: ['#a4a896', '#b0b4a4', '#989c8a'],
    pattern: 'solid',
  },
  {
    id: 'desert-grey',
    name: 'Desert Grey',
    nameAr: 'ديزرت جراي',
    fabric: 'Leather',
    fabricAr: 'جلد',
    collection: 'core',
    hexColor: '#6b6b6b', // Matches Brand Bible
    gradientColors: ['#6b6b6b', '#787878', '#5e5e5e'],
    pattern: 'solid',
    premium: true,
  },
  {
    id: 'amber-sand',
    name: 'Amber Sand',
    nameAr: 'أمبر ساند',
    fabric: 'Nubuck Leather',
    fabricAr: 'جلد نوبك',
    collection: 'core',
    hexColor: '#c9a26b', // Updated to match Brand Bible
    gradientColors: ['#c9a26b', '#d9b27b', '#b9925b'],
    pattern: 'textured',
    premium: true,
  },
  {
    id: 'mocha-taupe',
    name: 'Mocha Taupe',
    nameAr: 'موكا توب',
    fabric: 'Chenille',
    fabricAr: 'شينيل',
    collection: 'core',
    hexColor: '#8b7968', // Updated to match Brand Bible
    gradientColors: ['#8b7968', '#9b8978', '#7b6958'],
    pattern: 'textured',
  },
  {
    id: 'coastal-fog-grey',
    name: 'Coastal Fog Grey',
    nameAr: 'كوستال فوج جراي',
    fabric: 'Chenille',
    fabricAr: 'شينيل',
    collection: 'core',
    hexColor: '#9ca3a8', // Updated to match Brand Bible
    gradientColors: ['#9ca3a8', '#acb3b8', '#8c9398'],
    pattern: 'textured',
  },
];

// Cairo Trends - Modern Elegance (7 Colors)
export const cairoCollection: FabricColor[] = [
  {
    id: 'nile-mist-terracotta',
    name: 'Nile Mist Terracotta',
    nameAr: 'نايل ميست تيراكوتا',
    fabric: 'Cotton Velvet',
    fabricAr: 'مخمل قطني',
    collection: 'cairo',
    hexColor: '#c87157', // Updated to match Brand Bible
    gradientColors: ['#c87157', '#d88167', '#b86147'],
    pattern: 'solid',
    premium: true,
  },
  {
    id: 'giza-gold-weave',
    name: 'Giza Gold Weave',
    nameAr: 'جيزا جولد ويف',
    fabric: 'Woven Fabric',
    fabricAr: 'قماش منسوج',
    collection: 'cairo',
    hexColor: '#d4af37', // Matches Brand Bible - Brand Gold
    gradientColors: ['#d4af37', '#e4bf47', '#c49f27'],
    pattern: 'woven',
  },
  {
    id: 'oasis-green',
    name: 'Oasis Green',
    nameAr: 'أواسيس جرين',
    fabric: 'Performance Fabric',
    fabricAr: 'قماش عالي الأداء',
    collection: 'cairo',
    hexColor: '#6b8e6b', // Updated to match Brand Bible
    gradientColors: ['#6b8e6b', '#7b9e7b', '#5b7e5b'],
    pattern: 'solid',
  },
  {
    id: 'blue-nile-denim',
    name: 'Blue Nile Denim',
    nameAr: 'بلو نايل دينيم',
    fabric: 'Recycled Denim',
    fabricAr: 'دنيم معاد تدويره',
    collection: 'cairo',
    hexColor: '#4a6fa5', // Updated to match Brand Bible
    gradientColors: ['#4a6fa5', '#5a7fb5', '#3a5f95'],
    pattern: 'textured',
  },
  {
    id: 'sandstorm-ochre',
    name: 'Sandstorm Ochre',
    nameAr: 'ساندستورم أوكر',
    fabric: 'Cotton Blend',
    fabricAr: 'مزيج قطني',
    collection: 'cairo',
    hexColor: '#d4a574', // Updated to match Brand Bible
    gradientColors: ['#d4a574', '#e4b584', '#c49564'],
    pattern: 'striped',
  },
  {
    id: 'papyrus-stripe',
    name: 'Papyrus Stripe',
    nameAr: 'بابيروس سترايب',
    fabric: 'Linen Blend',
    fabricAr: 'مزيج كتاني',
    collection: 'cairo',
    hexColor: '#d9cbb8', // Updated to match Brand Bible
    gradientColors: ['#d9cbb8', '#e9dbc8', '#c9bba8'],
    pattern: 'striped',
  },
  {
    id: 'clay-pottery',
    name: 'Clay Pottery',
    nameAr: 'كلاي بوتري',
    fabric: 'Textured Woven',
    fabricAr: 'منسوج محبب',
    collection: 'cairo',
    hexColor: '#a0705a', // Updated to match Brand Bible
    gradientColors: ['#a0705a', '#b0806a', '#90604a'],
    pattern: 'woven',
    premium: true,
  },
];

// Combined collections export
export const fabricCollections: FabricCollection[] = [
  {
    id: 'core',
    name: 'Core Collection',
    nameAr: 'المجموعة الأساسية',
    tagline: 'Timeless Sophistication',
    taglineAr: 'أناقة خالدة',
    colors: coreCollection,
  },
  {
    id: 'cairo',
    name: 'Cairo Trends',
    nameAr: 'صيحات القاهرة',
    tagline: 'Modern Elegance',
    taglineAr: 'أناقة عصرية',
    colors: cairoCollection,
  },
];

// All colors combined for easy lookup
export const allFabricColors: FabricColor[] = [...coreCollection, ...cairoCollection];

// Helper function to get a fabric color by ID
export const getFabricColorById = (id: string): FabricColor | undefined => {
  return allFabricColors.find((color) => color.id === id);
};

// Helper function to get fabric colors by collection
export const getFabricColorsByCollection = (collection: 'core' | 'cairo'): FabricColor[] => {
  return allFabricColors.filter((color) => color.collection === collection);
};

// Map old color names to new fabric IDs for backward compatibility
export const colorNameToFabricId: Record<string, string> = {
  // Core mappings
  'Urban Charcoal': 'desert-grey',
  'Off White': 'alexandria-linen',
  'Elephant Grey': 'coastal-fog-grey',
  'Chic Red': 'nile-mist-terracotta',
  'Tan Beige': 'amber-sand',
  'Pink Rose': 'papyrus-stripe',
  'Sunshine Yellow': 'giza-gold-weave',
  'Ocean Blue': 'nile-sapphire-blue',
  'Warm Grey': 'mocha-taupe',
  'Creamy Beige': 'alexandria-linen',
  'Slate Grey': 'coastal-fog-grey',
  'Espresso Brown': 'mocha-taupe',
  'Stone Grey': 'desert-grey',
  'Navy Blue': 'blue-nile-denim',
  // Additional direct mappings using fabric names
  'Nile Sapphire Blue': 'nile-sapphire-blue',
  'Alexandria Linen': 'alexandria-linen',
  'Desert Sage': 'desert-sage',
  'Desert Grey': 'desert-grey',
  'Amber Sand': 'amber-sand',
  'Mocha Taupe': 'mocha-taupe',
  'Coastal Fog Grey': 'coastal-fog-grey',
  'Nile Mist Terracotta': 'nile-mist-terracotta',
  'Giza Gold Weave': 'giza-gold-weave',
  'Oasis Green': 'oasis-green',
  'Blue Nile Denim': 'blue-nile-denim',
  'Sandstorm Ochre': 'sandstorm-ochre',
  'Papyrus Stripe': 'papyrus-stripe',
  'Clay Pottery': 'clay-pottery',
  // Special
  'Coordinated Styles': 'alexandria-linen',
};

// Get fabric IDs for a product - returns all fabrics if no specific colors
export const getProductFabricIds = (colors: string[]): string[] => {
  if (!colors || colors.length === 0 || colors[0] === 'Coordinated Styles') {
    return allFabricColors.map((f) => f.id);
  }
  return colors.map((color) => colorNameToFabricId[color]).filter(Boolean);
};

// Helper to get color name based on current language
export const getColorDisplayName = (color: FabricColor, isArabic: boolean): string => {
  return isArabic ? color.nameAr : color.name;
};

// Helper to get fabric name based on current language
export const getFabricDisplayName = (color: FabricColor, isArabic: boolean): string => {
  return isArabic ? color.fabricAr : color.fabric;
};
