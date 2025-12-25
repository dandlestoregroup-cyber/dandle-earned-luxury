// Premium Fabric & Color Collections for Dandle Chairs

export interface FabricColor {
  id: string;
  name: string;
  fabric: string;
  collection: 'core' | 'cairo';
  hexColor: string;
  gradientColors?: string[]; // For texture simulation
  pattern?: 'solid' | 'textured' | 'striped' | 'woven';
  premium?: boolean;
}

export interface FabricCollection {
  id: string;
  name: string;
  tagline: string;
  colors: FabricColor[];
}

// Core Collection - Timeless Sophistication
export const coreCollection: FabricColor[] = [
  {
    id: 'nile-sapphire-blue',
    name: 'Nile Sapphire Blue',
    fabric: 'Velvet',
    collection: 'core',
    hexColor: '#1e4a6e',
    gradientColors: ['#1e4a6e', '#2a5d85', '#1a3d5c'],
    pattern: 'solid',
    premium: true,
  },
  {
    id: 'alexandria-linen',
    name: 'Alexandria Linen',
    fabric: 'Belgian Linen',
    collection: 'core',
    hexColor: '#d4c5a9',
    gradientColors: ['#d4c5a9', '#e0d4bc', '#c9b898'],
    pattern: 'textured',
  },
  {
    id: 'desert-sage',
    name: 'Desert Sage',
    fabric: 'Microsuede',
    collection: 'core',
    hexColor: '#8b9a6b',
    gradientColors: ['#8b9a6b', '#9aab78', '#7c8b5e'],
    pattern: 'solid',
  },
  {
    id: 'desert-grey',
    name: 'Desert Grey',
    fabric: 'Leather',
    collection: 'core',
    hexColor: '#6b6b6b',
    gradientColors: ['#6b6b6b', '#787878', '#5e5e5e'],
    pattern: 'solid',
    premium: true,
  },
  {
    id: 'amber-sand',
    name: 'Amber Sand',
    fabric: 'Nubuck Leather',
    collection: 'core',
    hexColor: '#c4a574',
    gradientColors: ['#c4a574', '#d4b584', '#b49564'],
    pattern: 'textured',
    premium: true,
  },
  {
    id: 'mocha-taupe',
    name: 'Mocha Taupe',
    fabric: 'Chenille',
    collection: 'core',
    hexColor: '#8b7355',
    gradientColors: ['#8b7355', '#9a8264', '#7c6446'],
    pattern: 'textured',
  },
  {
    id: 'coastal-fog-grey',
    name: 'Coastal Fog Grey',
    fabric: 'Chenille',
    collection: 'core',
    hexColor: '#9a9a8a',
    gradientColors: ['#9a9a8a', '#a8a898', '#8c8c7c'],
    pattern: 'textured',
  },
];

// Cairo Trends - Modern Elegance
export const cairoCollection: FabricColor[] = [
  {
    id: 'nile-mist-terracotta',
    name: 'Nile Mist Terracotta',
    fabric: 'Cotton Velvet',
    collection: 'cairo',
    hexColor: '#c45a3a',
    gradientColors: ['#c45a3a', '#d46a4a', '#b44a2a'],
    pattern: 'solid',
    premium: true,
  },
  {
    id: 'giza-gold-weave',
    name: 'Giza Gold Weave',
    fabric: 'Woven Fabric',
    collection: 'cairo',
    hexColor: '#c9a84e',
    gradientColors: ['#c9a84e', '#d9b85e', '#b9983e'],
    pattern: 'woven',
  },
  {
    id: 'oasis-green',
    name: 'Oasis Green',
    fabric: 'Performance Fabric',
    collection: 'cairo',
    hexColor: '#5a7a5a',
    gradientColors: ['#5a7a5a', '#6a8a6a', '#4a6a4a'],
    pattern: 'solid',
  },
  {
    id: 'blue-nile-denim',
    name: 'Blue Nile Denim',
    fabric: 'Recycled Denim',
    collection: 'cairo',
    hexColor: '#4a6a8a',
    gradientColors: ['#4a6a8a', '#5a7a9a', '#3a5a7a'],
    pattern: 'textured',
  },
  {
    id: 'sandstorm-ochre',
    name: 'Sandstorm Ochre',
    fabric: 'Cotton Blend',
    collection: 'cairo',
    hexColor: '#b8956a',
    gradientColors: ['#b8956a', '#c8a57a', '#a8855a'],
    pattern: 'striped',
  },
  {
    id: 'papyrus-stripe',
    name: 'Papyrus Stripe',
    fabric: 'Linen Blend',
    collection: 'cairo',
    hexColor: '#d8c8a8',
    gradientColors: ['#d8c8a8', '#e8d8b8', '#c8b898'],
    pattern: 'striped',
  },
  {
    id: 'clay-pottery',
    name: 'Clay Pottery',
    fabric: 'Textured Woven',
    collection: 'cairo',
    hexColor: '#b87a5a',
    gradientColors: ['#b87a5a', '#c88a6a', '#a86a4a'],
    pattern: 'woven',
    premium: true,
  },
];

// Combined collections export
export const fabricCollections: FabricCollection[] = [
  {
    id: 'core',
    name: 'Core Collection',
    tagline: 'Timeless Sophistication',
    colors: coreCollection,
  },
  {
    id: 'cairo',
    name: 'Cairo Trends',
    tagline: 'Modern Elegance',
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
    return allFabricColors.map(f => f.id);
  }
  return colors.map(color => colorNameToFabricId[color]).filter(Boolean);
};
