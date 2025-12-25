import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Crown } from 'lucide-react';
import {
  FabricColor,
  fabricCollections,
  allFabricColors,
} from '@/data/fabricColors';

interface ColorFabricSelectorProps {
  selectedColorId: string;
  onColorSelect: (colorId: string) => void;
  availableColorIds?: string[]; // Optional filter for available colors
}

// Fabric texture pattern component
const FabricTexture = ({ pattern, colors }: { pattern: string; colors: string[] }) => {
  const baseColor = colors[0];
  const lightColor = colors[1] || colors[0];
  const darkColor = colors[2] || colors[0];

  switch (pattern) {
    case 'striped':
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                ${baseColor},
                ${baseColor} 3px,
                ${lightColor} 3px,
                ${lightColor} 6px
              )`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </div>
      );
    case 'woven':
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(90deg, ${lightColor}22 1px, transparent 1px),
                linear-gradient(${darkColor}22 1px, transparent 1px),
                ${baseColor}
              `,
              backgroundSize: '4px 4px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-black/10" />
        </div>
      );
    case 'textured':
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, ${lightColor} 0%, transparent 30%),
                radial-gradient(circle at 80% 70%, ${darkColor} 0%, transparent 30%),
                ${baseColor}
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      );
    default: // solid
      return (
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${lightColor}, ${baseColor}, ${darkColor})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15" />
        </div>
      );
  }
};

// Individual fabric swatch component
const FabricSwatch = ({
  fabric,
  isSelected,
  onSelect,
  index,
}: {
  fabric: FabricColor;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative group cursor-pointer
        transition-all duration-300 ease-out
        focus:outline-none focus-visible:ring-2 focus-visible:ring-dandle-orange focus-visible:ring-offset-2
      `}
    >
      {/* Main swatch container */}
      <motion.div
        animate={{
          scale: isSelected ? 1.05 : isHovered ? 1.02 : 1,
          y: isSelected ? -4 : isHovered ? -2 : 0,
        }}
        transition={{ duration: 0.2 }}
        className={`
          relative w-full aspect-[4/5] rounded-xl overflow-hidden
          shadow-md
          ${isSelected
            ? 'shadow-xl shadow-dandle-orange/30 ring-3 ring-dandle-orange'
            : 'hover:shadow-lg'
          }
        `}
      >
        {/* Fabric texture background */}
        <FabricTexture
          pattern={fabric.pattern || 'solid'}
          colors={fabric.gradientColors || [fabric.hexColor]}
        />

        {/* Premium badge */}
        {fabric.premium && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg">
              <Crown className="w-2.5 h-2.5" />
              <span>PREMIUM</span>
            </div>
          </div>
        )}

        {/* Selection indicator */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <div className="bg-white rounded-full p-2 shadow-lg">
                <Check className="w-5 h-5 text-dandle-orange" strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover shine effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
      </motion.div>

      {/* Color info */}
      <div className="mt-3 text-center px-1">
        <motion.p
          animate={{ color: isSelected ? '#FF6B35' : '#1A1A1A' }}
          className="font-semibold text-sm leading-tight mb-1 line-clamp-2"
        >
          {fabric.name}
        </motion.p>
        <p className="text-xs text-charcoal/60 leading-tight">
          {fabric.fabric}
        </p>
      </div>

      {/* Radio indicator dot */}
      <div className="flex justify-center mt-2">
        <div
          className={`
            w-4 h-4 rounded-full border-2 transition-all duration-200
            flex items-center justify-center
            ${isSelected
              ? 'border-dandle-orange bg-dandle-orange'
              : 'border-charcoal/30 bg-white'
            }
          `}
        >
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-1.5 h-1.5 rounded-full bg-white"
            />
          )}
        </div>
      </div>
    </motion.button>
  );
};

// Collection header component
const CollectionHeader = ({
  name,
  tagline,
  isActive,
}: {
  name: string;
  tagline: string;
  isActive: boolean;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-3">
      <h4 className="font-headline text-lg text-charcoal font-bold">
        {name}
      </h4>
      <div className="h-px flex-1 bg-gradient-to-r from-warm-beige to-transparent" />
    </div>
    <p className="text-sm text-charcoal/60 italic mt-1 flex items-center gap-2">
      <Sparkles className="w-3.5 h-3.5 text-dandle-orange" />
      {tagline}
    </p>
  </div>
);

// Main ColorFabricSelector component
export const ColorFabricSelector = ({
  selectedColorId,
  onColorSelect,
  availableColorIds,
}: ColorFabricSelectorProps) => {
  // Filter colors if availableColorIds is provided
  const getFilteredColors = (colors: FabricColor[]) => {
    if (!availableColorIds || availableColorIds.length === 0) {
      return colors;
    }
    return colors.filter((color) => availableColorIds.includes(color.id));
  };

  // Find selected fabric details
  const selectedFabric = allFabricColors.find((f) => f.id === selectedColorId);

  return (
    <div className="space-y-8">
      {/* Selected color preview banner */}
      {selectedFabric && (
        <motion.div
          key={selectedColorId}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-r from-warm-white to-warm-beige/50 border border-warm-beige"
        >
          <div className="flex items-center gap-4">
            {/* Large preview swatch */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <FabricTexture
                pattern={selectedFabric.pattern || 'solid'}
                colors={selectedFabric.gradientColors || [selectedFabric.hexColor]}
              />
              <div className="absolute inset-0 ring-2 ring-dandle-orange/50 rounded-xl" />
            </div>

            {/* Selected color info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-dandle-orange font-semibold uppercase tracking-wider mb-1">
                Selected Fabric
              </p>
              <p className="font-headline text-xl text-charcoal font-bold truncate">
                {selectedFabric.name}
              </p>
              <p className="text-sm text-charcoal/70">
                {selectedFabric.fabric}
                {selectedFabric.premium && (
                  <span className="ml-2 inline-flex items-center gap-1 text-amber-600 font-semibold">
                    <Crown className="w-3 h-3" /> Premium
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Collections */}
      {fabricCollections.map((collection) => {
        const filteredColors = getFilteredColors(collection.colors);
        if (filteredColors.length === 0) return null;

        const hasSelectedInCollection = filteredColors.some(
          (c) => c.id === selectedColorId
        );

        return (
          <div key={collection.id}>
            <CollectionHeader
              name={collection.name}
              tagline={collection.tagline}
              isActive={hasSelectedInCollection}
            />
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {filteredColors.map((color, index) => (
                <FabricSwatch
                  key={color.id}
                  fabric={color}
                  isSelected={selectedColorId === color.id}
                  onSelect={() => onColorSelect(color.id)}
                  index={index}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ColorFabricSelector;
