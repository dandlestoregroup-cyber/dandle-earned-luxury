import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Check, Image, Music, RefreshCw, Play, Pause } from "lucide-react";

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

const sizes = ['mobile', 'tablet', 'desktop', 'ultrawide'] as const;

const getStorageUrl = (slideIndex: number, size: string) => {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/product-images/hero/slide-${slideIndex}-${size}.webp`;
};

const getMusicUrl = () => {
  const baseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${baseUrl}/storage/v1/object/public/product-images/hero/festive-music.mp3`;
};

const GenerateHeroAssets = () => {
  const [imageStatus, setImageStatus] = useState<Record<string, 'pending' | 'loading' | 'done' | 'error'>>({});
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [musicStatus, setMusicStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);

  // Check existing assets on mount
  useEffect(() => {
    checkExistingAssets();
  }, []);

  const checkExistingAssets = async () => {
    // Check images
    for (let s = 0; s < heroSlides.length; s++) {
      for (let z = 0; z < sizes.length; z++) {
        const url = getStorageUrl(s, sizes[z]);
        try {
          const res = await fetch(url, { method: 'HEAD' });
          if (res.ok) {
            const key = `${s}-${z}`;
            setImageStatus(prev => ({ ...prev, [key]: 'done' }));
            setImageUrls(prev => ({ ...prev, [key]: url }));
          }
        } catch {}
      }
    }

    // Check music
    const music = getMusicUrl();
    try {
      const res = await fetch(music, { method: 'HEAD' });
      if (res.ok) {
        setMusicStatus('done');
        setMusicUrl(music);
      }
    } catch {}
  };

  const generateImage = async (slideIndex: number, sizeIndex: number) => {
    const key = `${slideIndex}-${sizeIndex}`;
    setImageStatus(prev => ({ ...prev, [key]: 'loading' }));

    try {
      // Fetch the source image and convert to base64
      const sourceUrl = `/images/${heroSlides[slideIndex].source}`;
      console.log('Fetching source image from:', sourceUrl);
      
      const imgResponse = await fetch(sourceUrl);
      if (!imgResponse.ok) {
        throw new Error(`Failed to fetch source image: ${sourceUrl} (status: ${imgResponse.status})`);
      }
      
      const blob = await imgResponse.blob();
      console.log('Source image blob size:', blob.size, 'type:', blob.type);
      
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      console.log('Base64 length:', base64.length, 'prefix:', base64.substring(0, 50));

      toast.info(`Calling AI to generate ${sizes[sizeIndex]} for slide ${slideIndex + 1}...`);
      
      const { data, error } = await supabase.functions.invoke('generate-hero-images', {
        body: { slideIndex, sizeIndex, sourceImageBase64: base64 }
      });

      console.log('Edge function response:', data, error);

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setImageStatus(prev => ({ ...prev, [key]: 'done' }));
      setImageUrls(prev => ({ ...prev, [key]: data.publicUrl }));
      toast.success(`Generated slide ${slideIndex + 1} - ${sizes[sizeIndex]}`);
    } catch (err: any) {
      console.error('Image generation error:', err);
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
    } catch (err) {
      console.error('Music generation error:', err);
      setMusicStatus('error');
      toast.error('Music generation failed');
    }
  };

  const toggleMusic = () => {
    if (!audioRef) {
      const audio = new Audio(musicUrl);
      audio.onended = () => setIsPlaying(false);
      setAudioRef(audio);
      audio.play();
      setIsPlaying(true);
    } else {
      if (isPlaying) {
        audioRef.pause();
      } else {
        audioRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Generate Hero Assets</h1>
        <Button variant="outline" onClick={checkExistingAssets}>
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Previews
        </Button>
      </div>

      {/* Music Section */}
      <div className="mb-8 p-4 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Music className="w-5 h-5" /> Festive Music (60 seconds)
        </h2>
        <div className="flex items-center gap-4">
          <Button onClick={generateMusic} disabled={musicStatus === 'loading'}>
            {musicStatus === 'loading' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {musicStatus === 'done' ? 'Regenerate Music' : 'Generate Music'}
          </Button>
          
          {musicUrl && (
            <Button variant="outline" onClick={toggleMusic}>
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Preview'}
            </Button>
          )}
        </div>
        {musicUrl && (
          <p className="mt-3 text-sm text-muted-foreground break-all">
            <span className="font-medium">URL:</span> {musicUrl}
          </p>
        )}
      </div>

      {/* Images Section */}
      <div className="p-4 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Image className="w-5 h-5" /> Hero Images (9 slides × 4 sizes = 36)
        </h2>
        <Button onClick={generateAllImages} className="mb-6">Generate All Images</Button>
        
        <div className="grid gap-6">
          {heroSlides.map((slide, sIdx) => (
            <div key={sIdx} className="border rounded-lg p-4">
              <p className="font-medium mb-3">Slide {sIdx + 1}: {slide.color}</p>
              <p className="text-sm text-muted-foreground mb-3">Source: {slide.source}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {sizes.map((size, zIdx) => {
                  const status = imageStatus[`${sIdx}-${zIdx}`];
                  return (
                    <Button 
                      key={size} 
                      size="sm" 
                      variant={status === 'done' ? 'default' : 'outline'}
                      onClick={() => generateImage(sIdx, zIdx)} 
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                      {status === 'done' && <Check className="w-3 h-3 mr-1" />}
                      {size}
                    </Button>
                  );
                })}
              </div>

              {/* Image Previews */}
              <div className="grid grid-cols-4 gap-2">
                {sizes.map((size, zIdx) => {
                  const url = imageUrls[`${sIdx}-${zIdx}`];
                  return (
                    <div key={size} className="aspect-video bg-muted rounded overflow-hidden">
                      {url ? (
                        <img 
                          src={url} 
                          alt={`Slide ${sIdx + 1} ${size}`} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          {size}
                        </div>
                      )}
                    </div>
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
