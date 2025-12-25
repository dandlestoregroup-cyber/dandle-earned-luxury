import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Share2, Heart, Trophy, Wand2,
  RotateCcw, ChevronRight, Star, Palette,
  PartyPopper, Zap, Crown, Eye, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  allFabricColors,
  fabricCollections,
  FabricColor,
  getFabricColorById
} from '@/data/fabricColors';
import confetti from 'canvas-confetti';

// Color personality types for the game
const colorPersonalities = [
  { mood: 'Bold & Confident', colors: ['nile-mist-terracotta', 'nile-sapphire-blue', 'oasis-green'], emoji: '🔥' },
  { mood: 'Calm & Serene', colors: ['coastal-fog-grey', 'desert-sage', 'alexandria-linen'], emoji: '🌊' },
  { mood: 'Warm & Inviting', colors: ['amber-sand', 'mocha-taupe', 'sandstorm-ochre'], emoji: '☀️' },
  { mood: 'Luxe & Sophisticated', colors: ['desert-grey', 'giza-gold-weave', 'clay-pottery'], emoji: '✨' },
  { mood: 'Fresh & Modern', colors: ['blue-nile-denim', 'papyrus-stripe', 'oasis-green'], emoji: '🌿' },
];

// Achievement badges
const achievements = [
  { id: 'explorer', name: 'Color Explorer', desc: 'Try 5 different colors', icon: Eye, threshold: 5 },
  { id: 'connoisseur', name: 'Fabric Connoisseur', desc: 'Try 10 different colors', icon: Crown, threshold: 10 },
  { id: 'master', name: 'Color Master', desc: 'Try all 14 colors', icon: Trophy, threshold: 14 },
  { id: 'premium', name: 'Premium Taste', desc: 'Select a premium fabric', icon: Star, threshold: 1 },
];

// Playful messages when selecting colors
const colorMessages: Record<string, string[]> = {
  'nile-sapphire-blue': ["Royal choice!", "Deep as the Nile itself!", "Velvet dreams incoming!"],
  'alexandria-linen': ["Classic elegance!", "Timeless beauty!", "Pure sophistication!"],
  'desert-sage': ["Nature's embrace!", "Zen vibes activated!", "Peaceful & grounded!"],
  'desert-grey': ["Sleek & powerful!", "Modern luxury!", "Executive vibes!"],
  'amber-sand': ["Golden hour forever!", "Warm & cozy!", "Desert sunset vibes!"],
  'mocha-taupe': ["Coffee lover's dream!", "Rich & warm!", "Cozy café vibes!"],
  'coastal-fog-grey': ["Misty mornings!", "Calm & collected!", "Scandinavian chic!"],
  'nile-mist-terracotta': ["Bold statement!", "Fire & passion!", "Stand out!"],
  'giza-gold-weave': ["Pure gold!", "Pharaoh's choice!", "Majestic!"],
  'oasis-green': ["Fresh & alive!", "Garden paradise!", "Nature lover!"],
  'blue-nile-denim': ["Casual luxury!", "Denim dreams!", "Cool & collected!"],
  'sandstorm-ochre': ["Sun-kissed!", "Warm embrace!", "Desert vibes!"],
  'papyrus-stripe': ["Ancient elegance!", "Refined taste!", "Subtle beauty!"],
  'clay-pottery': ["Artisan touch!", "Earthy luxury!", "Handcrafted feel!"],
};

const ColorStudio = () => {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState<FabricColor>(allFabricColors[0]);
  const [testedColors, setTestedColors] = useState<Set<string>>(new Set([allFabricColors[0].id]));
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [showAchievement, setShowAchievement] = useState<typeof achievements[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchedPersonality, setMatchedPersonality] = useState<typeof colorPersonalities[0] | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Check for achievement unlocks
  const checkAchievements = useCallback((newTestedColors: Set<string>, selectedFabric: FabricColor) => {
    achievements.forEach(achievement => {
      if (unlockedAchievements.has(achievement.id)) return;

      let unlocked = false;
      if (achievement.id === 'explorer' && newTestedColors.size >= 5) unlocked = true;
      if (achievement.id === 'connoisseur' && newTestedColors.size >= 10) unlocked = true;
      if (achievement.id === 'master' && newTestedColors.size >= 14) unlocked = true;
      if (achievement.id === 'premium' && selectedFabric.premium) unlocked = true;

      if (unlocked) {
        setUnlockedAchievements(prev => new Set([...prev, achievement.id]));
        setShowAchievement(achievement);
        // Celebration confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => setShowAchievement(null), 3000);
      }
    });
  }, [unlockedAchievements]);

  // Handle color selection with gamification
  const handleColorSelect = (color: FabricColor) => {
    setSelectedColor(color);

    // Track tested colors
    const newTestedColors = new Set([...testedColors, color.id]);
    setTestedColors(newTestedColors);

    // Show fun message
    const messages = colorMessages[color.id] || ["Great choice!"];
    setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 2000);

    // Check achievements
    checkAchievements(newTestedColors, color);

    // Play subtle sound
    playSelectSound();
  };

  // Surprise me - random color picker with spin animation
  const handleSurpriseMe = () => {
    setIsSpinning(true);
    playSpinSound();

    // Rapid color cycling effect
    let iterations = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      const randomColor = allFabricColors[Math.floor(Math.random() * allFabricColors.length)];
      setSelectedColor(randomColor);
      iterations++;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalColor = allFabricColors[Math.floor(Math.random() * allFabricColors.length)];
        handleColorSelect(finalColor);
      }
    }, 100);
  };

  // Find my color personality
  const findColorPersonality = () => {
    const personality = colorPersonalities[Math.floor(Math.random() * colorPersonalities.length)];
    setMatchedPersonality(personality);
    const recommendedColor = getFabricColorById(personality.colors[0]);
    if (recommendedColor) {
      handleColorSelect(recommendedColor);
    }
    confetti({
      particleCount: 50,
      spread: 60,
      colors: ['#FF6B35', '#FFD700', '#1e4a6e']
    });
  };

  // Toggle favorite
  const toggleFavorite = (colorId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(colorId)) {
        newFavorites.delete(colorId);
      } else {
        newFavorites.add(colorId);
        playHeartSound();
      }
      return newFavorites;
    });
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: 'My Dandle Recliner Color Choice',
      text: `I just designed my perfect Dandle Recliner in ${selectedColor.name}! Check out their Color Studio!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.log('Share failed');
    }
  };

  // Confirm selection and go to product
  const handleConfirmSelection = () => {
    setShowConfirmation(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  // Sound effects
  const playSelectSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnYpBSuBzvLYiTcIGWi77eefTRAMUKfj8LZjHAY4ktfyy3ksBSR3x/DdkEAKFF606+uoVRQKRp/g8r5sIQQxh9Hz04IzBh5uwO/jmUgND1as5++wXRgIPpbb8sZ2KQUrgu7w1Io2Bxppu+3ln00QDFCN4/C2YxwGOJLX8st5LAUkd8fw3ZBAC');
    audio.volume = 0.2;
    audio.play().catch(() => {});
  };

  const playSpinSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19teleWQVZFZm10IBYAAAABAAEAQB8AAEA/AAACABAAZGF0YU');
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  const playHeartSound = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ');
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  // Color tint calculation for the chair image
  const getColorFilter = (hexColor: string) => {
    // Convert hex to HSL for filter
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h = 0;
    let s = 0;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      hue: Math.round(h * 360),
      saturation: Math.round(s * 100),
      lightness: Math.round(l * 100)
    };
  };

  const colorFilter = getColorFilter(selectedColor.hexColor);

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white via-warm-beige/30 to-warm-white">
      <Navigation />

      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-dandle-orange/10 text-dandle-orange px-4 py-2 rounded-full mb-4">
                <Palette className="w-5 h-5" />
                <span className="font-semibold">Interactive Color Studio</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-charcoal font-bold mb-4">
                Design Your Dream <span className="text-dandle-orange">Recliner</span>
              </h1>
              <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                Play with 14 premium fabrics. Find your perfect match.
                <span className="font-semibold text-dandle-orange"> It's surprisingly addictive!</span>
              </p>
            </motion.div>

            {/* Progress & Achievements Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4 mb-8"
            >
              {/* Colors tested counter */}
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-warm-beige">
                <Eye className="w-4 h-4 text-dandle-orange" />
                <span className="text-sm font-medium">
                  <span className="text-dandle-orange font-bold">{testedColors.size}</span>/14 colors tested
                </span>
              </div>

              {/* Unlocked achievements */}
              {achievements.filter(a => unlockedAchievements.has(a.id)).map(achievement => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-50 px-3 py-1.5 rounded-full border border-amber-200"
                >
                  <achievement.icon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-700">{achievement.name}</span>
                </motion.div>
              ))}

              {/* Favorites count */}
              {favorites.size > 0 && (
                <div className="flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full border border-pink-200">
                  <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                  <span className="text-xs font-semibold text-pink-600">{favorites.size} favorites</span>
                </div>
              )}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">

              {/* Left: Interactive Chair Preview */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                {/* Chair Display Container */}
                <div className="relative bg-gradient-to-br from-warm-beige/50 to-warm-white rounded-3xl p-6 shadow-xl border border-warm-beige overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => toggleFavorite(selectedColor.id)}
                      className="p-2 bg-white/80 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(selectedColor.id)
                            ? 'text-pink-500 fill-pink-500'
                            : 'text-charcoal/40'
                        }`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 bg-white/80 rounded-full shadow-md hover:scale-110 transition-transform"
                    >
                      <Share2 className="w-5 h-5 text-charcoal/60" />
                    </button>
                  </div>

                  {/* Chair Image with Color Overlay */}
                  <div className="relative aspect-[4/3] flex items-center justify-center">
                    <motion.div
                      key={selectedColor.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`relative w-full h-full ${isSpinning ? 'animate-pulse' : ''}`}
                    >
                      {/* Base chair image */}
                      <img
                        src="/images/relaxmax-hero-offwhite.jpg"
                        alt="Dandle Recliner Preview"
                        className="w-full h-full object-contain rounded-xl"
                        style={{
                          filter: `sepia(100%) saturate(300%) brightness(${colorFilter.lightness > 50 ? 1 : 0.85}) hue-rotate(${colorFilter.hue - 50}deg)`,
                        }}
                      />

                      {/* Color overlay for fabric simulation */}
                      <div
                        className="absolute inset-0 rounded-xl mix-blend-multiply opacity-50"
                        style={{ backgroundColor: selectedColor.hexColor }}
                      />

                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
                    </motion.div>

                    {/* Fun Message Popup */}
                    <AnimatePresence>
                      {showMessage && (
                        <motion.div
                          initial={{ scale: 0, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0, y: -20 }}
                          className="absolute top-4 left-1/2 -translate-x-1/2 bg-dandle-orange text-white px-4 py-2 rounded-full font-bold shadow-lg"
                        >
                          {currentMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Selected Color Info */}
                  <motion.div
                    key={selectedColor.id + '-info'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-warm-beige"
                  >
                    <div
                      className="w-16 h-16 rounded-xl shadow-md flex-shrink-0"
                      style={{
                        background: selectedColor.gradientColors
                          ? `linear-gradient(135deg, ${selectedColor.gradientColors.join(', ')})`
                          : selectedColor.hexColor
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-headline text-xl text-charcoal font-bold">
                          {selectedColor.name}
                        </h3>
                        {selectedColor.premium && (
                          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Crown className="w-3 h-3" /> PREMIUM
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-charcoal/60">{selectedColor.fabric}</p>
                    </div>
                  </motion.div>

                  {/* Matched Personality Badge */}
                  <AnimatePresence>
                    {matchedPersonality && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200"
                      >
                        <p className="text-sm text-purple-600 font-medium">
                          Your Color Personality: <span className="font-bold">{matchedPersonality.emoji} {matchedPersonality.mood}</span>
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 justify-center">
                  <Button
                    onClick={handleSurpriseMe}
                    disabled={isSpinning}
                    variant="outline"
                    className="flex items-center gap-2 border-dandle-orange text-dandle-orange hover:bg-dandle-orange hover:text-white transition-all"
                  >
                    <Wand2 className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                    Surprise Me!
                  </Button>

                  <Button
                    onClick={findColorPersonality}
                    variant="outline"
                    className="flex items-center gap-2 border-purple-400 text-purple-600 hover:bg-purple-500 hover:text-white transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Find My Style
                  </Button>

                  <Button
                    onClick={() => {
                      setTestedColors(new Set([allFabricColors[0].id]));
                      setSelectedColor(allFabricColors[0]);
                      setMatchedPersonality(null);
                      setFavorites(new Set());
                    }}
                    variant="ghost"
                    className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Start Over
                  </Button>
                </div>
              </motion.div>

              {/* Right: Color Swatches */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                {fabricCollections.map((collection, collectionIndex) => (
                  <div key={collection.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-warm-beige shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-8 rounded-full bg-gradient-to-b from-dandle-orange to-dandle-orange/50" />
                      <div>
                        <h3 className="font-headline text-lg font-bold text-charcoal">{collection.name}</h3>
                        <p className="text-sm text-charcoal/60 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-dandle-orange" />
                          {collection.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                      {collection.colors.map((color, index) => {
                        const isSelected = selectedColor.id === color.id;
                        const isFavorite = favorites.has(color.id);
                        const isTested = testedColors.has(color.id);

                        return (
                          <motion.button
                            key={color.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: collectionIndex * 0.1 + index * 0.03 }}
                            onClick={() => handleColorSelect(color)}
                            className={`
                              relative group aspect-square rounded-xl overflow-hidden
                              transition-all duration-300
                              ${isSelected
                                ? 'ring-3 ring-dandle-orange ring-offset-2 scale-110 shadow-lg z-10'
                                : 'hover:scale-105 hover:shadow-md'
                              }
                            `}
                            title={`${color.name} - ${color.fabric}`}
                          >
                            {/* Color swatch */}
                            <div
                              className="absolute inset-0"
                              style={{
                                background: color.gradientColors
                                  ? `linear-gradient(135deg, ${color.gradientColors.join(', ')})`
                                  : color.hexColor
                              }}
                            />

                            {/* Pattern overlay */}
                            {color.pattern === 'striped' && (
                              <div
                                className="absolute inset-0 opacity-30"
                                style={{
                                  background: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)`
                                }}
                              />
                            )}
                            {color.pattern === 'woven' && (
                              <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                  background: `linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)`,
                                  backgroundSize: '3px 3px'
                                }}
                              />
                            )}

                            {/* Shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Premium badge */}
                            {color.premium && (
                              <div className="absolute top-0.5 right-0.5">
                                <Crown className="w-3 h-3 text-amber-400 drop-shadow-md" />
                              </div>
                            )}

                            {/* Selection checkmark */}
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/20"
                              >
                                <div className="bg-white rounded-full p-1 shadow-md">
                                  <Check className="w-3 h-3 text-dandle-orange" strokeWidth={3} />
                                </div>
                              </motion.div>
                            )}

                            {/* Favorite indicator */}
                            {isFavorite && !isSelected && (
                              <div className="absolute bottom-0.5 left-0.5">
                                <Heart className="w-3 h-3 text-pink-500 fill-pink-500 drop-shadow-md" />
                              </div>
                            )}

                            {/* Tested indicator */}
                            {isTested && !isSelected && (
                              <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-green-400 rounded-full border border-white" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    onClick={handleConfirmSelection}
                    size="lg"
                    className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-bold text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="flex items-center gap-2">
                      <PartyPopper className="w-5 h-5" />
                      I Love {selectedColor.name}! Let's Order
                      <ChevronRight className="w-5 h-5" />
                    </span>
                  </Button>
                  <p className="text-center text-sm text-charcoal/50 mt-3">
                    Starting from EGP 28,500 · Free Delivery · 5-Year Warranty
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Achievement Popup */}
        <AnimatePresence>
          {showAchievement && (
            <motion.div
              initial={{ opacity: 0, y: 100, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 100, x: '-50%' }}
              className="fixed bottom-8 left-1/2 z-50 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <showAchievement.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium opacity-90">Achievement Unlocked!</p>
                <p className="font-bold text-lg">{showAchievement.name}</p>
              </div>
              <Trophy className="w-8 h-8 ml-2 animate-bounce" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowConfirmation(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-dandle-orange/20 to-dandle-orange/5 flex items-center justify-center">
                  <PartyPopper className="w-10 h-10 text-dandle-orange" />
                </div>

                <h2 className="font-headline text-2xl font-bold text-charcoal mb-2">
                  Excellent Choice!
                </h2>
                <p className="text-charcoal/70 mb-6">
                  Your <span className="font-bold text-dandle-orange">{selectedColor.name}</span> Dandle Recliner
                  is waiting for you. Ready to make it yours?
                </p>

                <div
                  className="w-full aspect-video rounded-xl mb-6 shadow-md"
                  style={{
                    background: selectedColor.gradientColors
                      ? `linear-gradient(135deg, ${selectedColor.gradientColors.join(', ')})`
                      : selectedColor.hexColor
                  }}
                />

                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => navigate('/#products')}
                    className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white font-bold py-6 rounded-xl"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    View All Recliners
                  </Button>
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    variant="ghost"
                    className="text-charcoal/60"
                  >
                    Keep Exploring Colors
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default ColorStudio;
