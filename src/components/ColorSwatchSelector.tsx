import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  allFabricColors,
  fabricCollections,
  FabricColor,
  getColorDisplayName,
  getFabricDisplayName,
} from '@/data/fabricColors';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { isRTL } from '@/i18n/config';

interface ColorSwatchSelectorProps {
  selectedColorId?: string;
  onColorSelect: (color: FabricColor) => void;
  availableColors?: string[]; // IDs of available colors for this product
  showCollections?: boolean; // Show collection grouping
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ColorSwatchSelector = ({
  selectedColorId,
  onColorSelect,
  availableColors,
  showCollections = false,
  size = 'md',
  className,
}: ColorSwatchSelectorProps) => {
  const { t } = useTranslation();
  const isArabic = isRTL();

  // Filter colors if availableColors is provided
  const getAvailableColors = (): FabricColor[] => {
    if (!availableColors || availableColors.length === 0) {
      return allFabricColors;
    }
    return allFabricColors.filter((color) => availableColors.includes(color.id));
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const renderSwatch = (color: FabricColor) => (
    <TooltipProvider key={color.id} delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => onColorSelect(color)}
            className={cn(
              'color-swatch rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]',
              sizeClasses[size],
              selectedColorId === color.id && 'selected',
              color.premium && 'ring-1 ring-[#d4af37]/30'
            )}
            style={{
              backgroundColor: color.hexColor,
              background: color.gradientColors
                ? `linear-gradient(135deg, ${color.gradientColors.join(', ')})`
                : color.hexColor,
            }}
            aria-label={getColorDisplayName(color, isArabic)}
            aria-pressed={selectedColorId === color.id}
          />
        </TooltipTrigger>
        <TooltipContent
          side={isArabic ? 'left' : 'right'}
          className="bg-card text-card-foreground border border-border"
        >
          <div className="text-sm">
            <p className="font-medium">{getColorDisplayName(color, isArabic)}</p>
            <p className="text-xs text-muted-foreground">
              {getFabricDisplayName(color, isArabic)}
            </p>
            {color.premium && (
              <p className="text-xs text-[#d4af37] mt-1">
                {isArabic ? 'فاخر' : 'Premium'}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  if (showCollections) {
    return (
      <div className={cn('space-y-6', className)}>
        {fabricCollections.map((collection) => {
          const collectionColors = collection.colors.filter((color) =>
            !availableColors || availableColors.length === 0
              ? true
              : availableColors.includes(color.id)
          );

          if (collectionColors.length === 0) return null;

          return (
            <div key={collection.id} className="space-y-3">
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-foreground">
                  {isArabic ? collection.nameAr : collection.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? collection.taglineAr : collection.tagline}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {collectionColors.map(renderSwatch)}
              </div>
            </div>
          );
        })}

        {/* Color disclaimer */}
        <p className="text-xs text-muted-foreground italic mt-4">
          {t('colorDisclaimer')}
        </p>
      </div>
    );
  }

  // Simple flat list
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap gap-2">
        {getAvailableColors().map(renderSwatch)}
      </div>

      {/* Color disclaimer */}
      <p className="text-xs text-muted-foreground italic">
        {t('colorDisclaimer')}
      </p>
    </div>
  );
};

export default ColorSwatchSelector;
