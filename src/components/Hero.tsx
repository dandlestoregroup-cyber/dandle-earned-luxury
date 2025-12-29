import { useState, useEffect } from "react";
import HeroGiftingSeason from "./hero/HeroGiftingSeason";

const Hero = () => {
  const [useGeneratedImages, setUseGeneratedImages] = useState(false);
  const [musicUrl, setMusicUrl] = useState("");

  useEffect(() => {
    const checkGeneratedAssets = async () => {
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      
      // Check if first generated image exists
      const imageUrl = `${baseUrl}/storage/v1/object/public/product-images/hero/slide-0-desktop.webp`;
      try {
        const imgRes = await fetch(imageUrl, { method: "HEAD" });
        if (imgRes.ok) setUseGeneratedImages(true);
      } catch {
        // Fallback to local images
      }

      // Check for generated music
      const musicCheckUrl = `${baseUrl}/storage/v1/object/public/product-images/hero/festive-music.mp3`;
      try {
        const musicRes = await fetch(musicCheckUrl, { method: "HEAD" });
        if (musicRes.ok) setMusicUrl(musicCheckUrl);
      } catch {
        // No music available
      }
    };

    checkGeneratedAssets();
  }, []);

  return <HeroGiftingSeason useGeneratedImages={useGeneratedImages} musicUrl={musicUrl} />;
};

export default Hero;
