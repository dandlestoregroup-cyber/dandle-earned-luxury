import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, Image, Music } from "lucide-react";

const heroSlides = [
  { source: 'relaxmax-hero-offwhite.jpg', color: 'Alexandria Linen' },
  { source: 'relaxmax-lifestyle-night.png', color: 'Mocha Taupe' },
  { source: 'cozycompanion-couple-lifestyle.jpg', color: 'Giza Gold Weave' },
  { source: 'relaxmax-lifestyle-day.png', color: 'Desert Sage' },
  { source: 'complete-set-classic.jpg', color: 'Alexandria Linen' },
  { source: 'spacesaver-offwhite-reclined.jpg', color: 'Nile Mist Terracotta' },
  { source: 'easyup-beige-lifted.jpg', color: 'Background Only' },
  { source: 'cozycompanion-beige-front.jpg', color: 'Desert Sage' },
  { source: 'worknest-blue-front.webp', color: 'Mocha Taupe' },
];

const sizes = ['mobile', 'tablet', 'desktop', 'ultrawide'];

const GenerateHeroAssets = () => {
  const [imageStatus, setImageStatus] = useState<Record<string, 'pending' | 'loading' | 'done' | 'error'>>({});
  const [musicStatus, setMusicStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [musicUrl, setMusicUrl] = useState<string>('');

  const generateImage = async (slideIndex: number, sizeIndex: number) => {
    const key = `${slideIndex}-${sizeIndex}`;
    setImageStatus(prev => ({ ...prev, [key]: 'loading' }));

    try {
      const sourceUrl = `${window.location.origin}/images/${heroSlides[slideIndex].source}`;
      const { data, error } = await supabase.functions.invoke('generate-hero-images', {
        body: { slideIndex, sizeIndex, sourceImageUrl: sourceUrl }
      });

      if (error) throw error;
      setImageStatus(prev => ({ ...prev, [key]: 'done' }));
      toast.success(`Generated slide ${slideIndex + 1} - ${sizes[sizeIndex]}`);
    } catch (err) {
      setImageStatus(prev => ({ ...prev, [key]: 'error' }));
      toast.error(`Failed: slide ${slideIndex + 1} - ${sizes[sizeIndex]}`);
    }
  };

  const generateAllImages = async () => {
    for (let s = 0; s < heroSlides.length; s++) {
      for (let z = 0; z < sizes.length; z++) {
        await generateImage(s, z);
      }
    }
  };

  const generateMusic = async () => {
    setMusicStatus('loading');
    try {
      const { data, error } = await supabase.functions.invoke('generate-hero-music');
      if (error) throw error;
      setMusicUrl(data.publicUrl);
      setMusicStatus('done');
      toast.success('Festive music generated!');
    } catch {
      setMusicStatus('error');
      toast.error('Music generation failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate Hero Assets</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Music className="w-5 h-5" /> Festive Music
        </h2>
        <Button onClick={generateMusic} disabled={musicStatus === 'loading'}>
          {musicStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {musicStatus === 'done' ? 'Regenerate Music' : 'Generate 60s Music'}
        </Button>
        {musicUrl && <p className="mt-2 text-sm text-muted-foreground">URL: {musicUrl}</p>}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" /> Hero Images (9 slides × 4 sizes = 36)
        </h2>
        <Button onClick={generateAllImages} className="mb-4">Generate All Images</Button>
        
        <div className="grid gap-4">
          {heroSlides.map((slide, sIdx) => (
            <div key={sIdx} className="border rounded-lg p-4">
              <p className="font-medium mb-2">Slide {sIdx + 1}: {slide.color}</p>
              <div className="flex gap-2">
                {sizes.map((size, zIdx) => {
                  const status = imageStatus[`${sIdx}-${zIdx}`];
                  return (
                    <Button key={size} size="sm" variant="outline" onClick={() => generateImage(sIdx, zIdx)} disabled={status === 'loading'}>
                      {status === 'loading' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {status === 'done' && <Check className="w-3 h-3 mr-1 text-green-500" />}
                      {size}
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerateHeroAssets;
