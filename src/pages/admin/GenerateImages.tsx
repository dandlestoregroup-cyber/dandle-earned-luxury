import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PRODUCTS = [
  { handle: "diva", name: "Diva Recliner", prompt: "Luxurious red leather power recliner, Egyptian artisan craftsmanship, warm ambient lighting, modern living room, champagne-gold Dandle watermark, muted orange underline" },
  { handle: "relaxmax", name: "RelaxMax Recliner", prompt: "Premium off-white fabric recliner, ultra-comfort engineering, contemporary minimalist setting, champagne-gold Dandle watermark" },
  { handle: "cozycompanion", name: "CozyCompanion Loveseat", prompt: "Two-seater loveseat recliner, beige premium fabric, couple relaxation scene, champagne-gold Dandle watermark" },
  { handle: "worknest", name: "WorkNest Recliner", prompt: "Executive ergonomic recliner, productivity-focused design, home office setting, champagne-gold Dandle watermark" },
  { handle: "spacesaver", name: "SpaceSaver Recliner", prompt: "Compact wall-hugger recliner, space-efficient design, small apartment lifestyle, champagne-gold Dandle watermark" },
  { handle: "comfortplus", name: "ComfortPlus Recliner", prompt: "Enhanced ergonomic recliner, premium comfort features, professional environment, champagne-gold Dandle watermark" },
  { handle: "easyup", name: "EasyUp Lift Recliner", prompt: "Power lift recliner, mobility assistance design, accessible living, champagne-gold Dandle watermark" },
  { handle: "complete-set", name: "Complete Living Room Set", prompt: "Curated living room configuration, multiple Dandle recliners, lifestyle showcase, champagne-gold Dandle watermark" }
];

const IMAGE_TYPES = [
  { value: "hero-01", label: "Hero Shot" },
  { value: "gallery-01", label: "Gallery 01" },
  { value: "gallery-02", label: "Gallery 02" },
  { value: "gallery-03", label: "Gallery 03" },
  { value: "gallery-04", label: "Gallery 04" },
  { value: "gallery-05", label: "Gallery 05" }
];

const GenerateImages = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedImageType, setSelectedImageType] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentPrompt = () => {
    if (customPrompt) return customPrompt;
    const product = PRODUCTS.find(p => p.handle === selectedProduct);
    return product?.prompt || "";
  };

  const handleGenerate = async () => {
    if (!selectedProduct || !selectedImageType || !referenceFile) {
      toast.error("Please select product, image type, and upload a reference image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl("");

    try {
      // Upload reference image to temporary storage
      const fileExt = referenceFile.name.split('.').pop();
      const fileName = `temp-ref-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`temp/${fileName}`, referenceFile);

      if (uploadError) throw uploadError;

      // Get public URL of reference image
      const { data: { publicUrl: referenceUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(`temp/${fileName}`);

      // Call edge function to generate image
      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          referenceImageUrl: referenceUrl,
          prompt: getCurrentPrompt(),
          productHandle: selectedProduct,
          imageType: selectedImageType
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes("Rate limits")) {
          toast.error("AI rate limits exceeded. Please try again in a few moments.");
        } else if (data.error.includes("Payment required")) {
          toast.error("AI credits depleted. Please add funds to continue.");
        } else {
          toast.error(`Generation failed: ${data.error}`);
        }
        return;
      }

      setGeneratedImageUrl(data.url);
      toast.success("Image generated successfully! Preview below.");

      // Clean up temp reference image
      await supabase.storage.from('product-images').remove([`temp/${fileName}`]);

    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-24">
        <h1 className="font-headline text-4xl md:text-6xl mb-8 text-foreground">
          AI Image Generator
        </h1>
        <p className="font-body text-lg text-muted-foreground mb-12">
          Upload reference images and generate branded product images using AI
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Controls */}
          <div className="space-y-6">
            <div>
              <label className="block font-body text-sm mb-2">Product</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map(product => (
                    <SelectItem key={product.handle} value={product.handle}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-body text-sm mb-2">Image Type</label>
              <Select value={selectedImageType} onValueChange={setSelectedImageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select image type" />
                </SelectTrigger>
                <SelectContent>
                  {IMAGE_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-body text-sm mb-2">Reference Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full p-3 border border-border rounded-md bg-background"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img src={previewUrl} alt="Reference" className="w-full rounded-md" />
                </div>
              )}
            </div>

            <div>
              <label className="block font-body text-sm mb-2">
                Custom Prompt (optional)
              </label>
              <Textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={getCurrentPrompt()}
                className="min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedProduct || !selectedImageType || !referenceFile}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            <div>
              <h3 className="font-headline text-2xl mb-4">Preview</h3>
              {generatedImageUrl ? (
                <div className="space-y-4">
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated" 
                    className="w-full rounded-md border border-border"
                  />
                  <div className="p-4 bg-muted rounded-md">
                    <p className="font-body text-sm text-muted-foreground mb-2">
                      Image URL:
                    </p>
                    <code className="text-xs break-all">{generatedImageUrl}</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ✅ Image saved to Supabase Storage. Update lovableCatalog.ts with this URL.
                  </p>
                </div>
              ) : (
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Generated image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default GenerateImages;
