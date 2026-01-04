import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Play, CheckCircle2, XCircle, Image as ImageIcon } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Reference images from local public/images folder
interface ReferenceImage {
  id: string;
  url: string;
  product: string;
  handle: string;
  description: string;
}

const REFERENCE_IMAGES: ReferenceImage[] = [
  { id: "01", url: "/images/relaxmax-hero-offwhite.jpg", product: "RelaxMax", handle: "relaxmax", description: "Hero off-white" },
  { id: "02", url: "/images/relaxmax-brown-lifestyle.jpg", product: "RelaxMax", handle: "relaxmax", description: "Brown lifestyle" },
  { id: "03", url: "/images/diva-red-front.jpg", product: "Diva", handle: "diva", description: "Red front" },
  { id: "04", url: "/images/cozycompanion-beige-front.jpg", product: "CozyCompanion", handle: "cozycompanion", description: "Beige front" },
  { id: "05", url: "/images/cozycompanion-yellow-front.jpg", product: "CozyCompanion", handle: "cozycompanion", description: "Yellow front" },
  { id: "06", url: "/images/cozycompanion-couple-lifestyle.jpg", product: "CozyCompanion", handle: "cozycompanion", description: "Couple lifestyle" },
  { id: "07", url: "/images/easyup-beige-front.jpg", product: "EasyUp", handle: "easyup", description: "Beige front" },
  { id: "08", url: "/images/easyup-beige-lifted.jpg", product: "EasyUp", handle: "easyup", description: "Beige lifted" },
  { id: "09", url: "/images/easyup-compact-charcoal-front.jpg", product: "EasyUp Compact", handle: "easyup-compact", description: "Charcoal front" },
  { id: "10", url: "/images/easyup-compact-charcoal-reclined.png", product: "EasyUp Compact", handle: "easyup-compact", description: "Charcoal reclined" },
  { id: "11", url: "/images/spacesaver-offwhite-reclined.jpg", product: "SpaceSaver", handle: "spacesaver", description: "Off-white reclined" },
  { id: "12", url: "/images/spacesaver-offwhite-side.jpg", product: "SpaceSaver", handle: "spacesaver", description: "Off-white side" },
  { id: "13", url: "/images/complete-set-classic.jpg", product: "Complete Set", handle: "complete-set", description: "Classic" },
  { id: "14", url: "/images/complete-set-coastal-modern.jpg", product: "Complete Set", handle: "complete-set", description: "Coastal modern" },
  { id: "15", url: "/images/complete-set-family-modern.jpg", product: "Complete Set", handle: "complete-set", description: "Family modern" },
];

// Composition rules for 85% product fill
const COMPOSITION_RULES = `
CRITICAL COMPOSITION REQUIREMENTS:
- Product MUST occupy exactly 85% of the total image area (±2% tolerance)
- Product MUST be perfectly centered in frame (both horizontally and vertically)
- Product MUST be shown in FULL - absolutely NO cropping of any elements
- Preserve 100% of original product design, colors, textures, stitching, and details
- NO stretching or distortion - maintain original product proportions exactly
- Output resolution: 2752x1536 pixels (aspect ratio 16:9)
- Ultra-sharp focus, professional studio lighting quality
- Color accuracy: exact match to reference image colors
`;

// Generation presets with brand-consistent prompts + 85% fill rule
const GENERATION_PRESETS = [
  {
    id: "lifestyle-day",
    label: "Lifestyle Day",
    prompt: `${COMPOSITION_RULES}
SCENE: Transform this recliner into a lifestyle scene - Modern Egyptian penthouse apartment, warm natural sunlight streaming through floor-to-ceiling windows overlooking Cairo, Mediterranean indoor plants, neutral cream and beige palette with bronze accents. Subtle champagne-gold DANDLE watermark in bottom right corner. Quiet refined aesthetic, aspirational but understated.`,
  },
  {
    id: "lifestyle-night",
    label: "Lifestyle Night", 
    prompt: `${COMPOSITION_RULES}
SCENE: Transform this recliner into an evening scene - Elegant Egyptian living room at golden hour, warm ambient lighting from designer lamps, soft shadows, cozy atmosphere with a cup of tea on side table. Rich warm tones, bronze and champagne accents. Subtle champagne-gold DANDLE watermark in bottom right corner. Quiet refined aesthetic.`,
  },
  {
    id: "reclined-view",
    label: "Reclined Position",
    prompt: `${COMPOSITION_RULES}
SCENE: Show this recliner in fully reclined position - Same chair design but extended footrest visible, backrest reclined to relaxation angle. Clean studio background with soft gradient, professional product photography lighting. Subtle champagne-gold DANDLE watermark.`,
  },
  {
    id: "angle-side",
    label: "Side Angle",
    prompt: `${COMPOSITION_RULES}
SCENE: Show this recliner from a 45-degree side profile angle - Emphasize the elegant silhouette and premium craftsmanship details. Clean neutral background, professional studio lighting with soft shadows. Subtle champagne-gold DANDLE watermark.`,
  },
  {
    id: "detail-texture",
    label: "Detail Texture",
    prompt: `${COMPOSITION_RULES}
SCENE: Close-up macro shot of this recliner's upholstery - Show premium leather or fabric texture, stitching details, armrest craftsmanship. Shallow depth of field, professional product photography. Emphasize quality materials. Subtle champagne-gold DANDLE watermark.`,
  },
];

// Priority products for batch generation
interface ProductPriority {
  handle: string;
  name: string;
  priority: "high" | "medium" | "skip";
  referenceIds: string[];
  presetsToGenerate: string[];
}

const PRODUCT_PRIORITIES: ProductPriority[] = [
  { handle: "diva", name: "Diva", priority: "high", referenceIds: ["03"], presetsToGenerate: ["lifestyle-day", "lifestyle-night", "angle-side"] },
  { handle: "cozycompanion", name: "CozyCompanion", priority: "high", referenceIds: ["04", "05", "06"], presetsToGenerate: ["lifestyle-day", "angle-side"] },
  { handle: "relaxmax", name: "RelaxMax", priority: "medium", referenceIds: ["01", "02"], presetsToGenerate: ["lifestyle-night"] },
  { handle: "easyup", name: "EasyUp", priority: "medium", referenceIds: ["07", "08"], presetsToGenerate: ["lifestyle-day"] },
  { handle: "easyup-compact", name: "EasyUp Compact", priority: "medium", referenceIds: ["09", "10"], presetsToGenerate: ["lifestyle-day"] },
  { handle: "spacesaver", name: "SpaceSaver", priority: "medium", referenceIds: ["11", "12"], presetsToGenerate: ["lifestyle-day"] },
  { handle: "complete-set", name: "Complete Set", priority: "medium", referenceIds: ["13", "14", "15"], presetsToGenerate: [] },
];

interface GenerationJob {
  id: string;
  productHandle: string;
  referenceId: string;
  presetId: string;
  status: "pending" | "processing" | "complete" | "error";
  outputUrl?: string;
  error?: string;
}

const GenerateImages = () => {
  // Single generation mode
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");
  const [selectedReference, setSelectedReference] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  
  // Batch mode
  const [batchMode, setBatchMode] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [batchJobs, setBatchJobs] = useState<GenerationJob[]>([]);
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [catalogCode, setCatalogCode] = useState("");

  const getProductReferences = (handle: string) => {
    return REFERENCE_IMAGES.filter(ref => ref.handle === handle);
  };

  const getCurrentPrompt = () => {
    if (customPrompt) return customPrompt;
    const preset = GENERATION_PRESETS.find(p => p.id === selectedPreset);
    return preset?.prompt || "";
  };

  // Convert local image to base64
  const imageToBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSingleGenerate = async () => {
    if (!selectedProduct || !selectedPreset || !selectedReference) {
      toast.error("Please select product, preset, and reference image");
      return;
    }

    setIsGenerating(true);
    setGeneratedImageUrl("");

    try {
      const reference = REFERENCE_IMAGES.find(r => r.id === selectedReference);
      if (!reference) throw new Error("Reference not found");

      // Convert local image to base64
      const imageBase64 = await imageToBase64(reference.url);

      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          imageBase64,
          prompt: getCurrentPrompt(),
          productHandle: selectedProduct,
          imageType: `${selectedPreset}-${selectedReference}`
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
      toast.success("Image generated successfully!");

    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const buildBatchQueue = () => {
    const jobs: GenerationJob[] = [];
    
    PRODUCT_PRIORITIES
      .filter(p => p.priority !== "skip" && p.presetsToGenerate.length > 0)
      .forEach(product => {
        const primaryRef = product.referenceIds[0];
        product.presetsToGenerate.forEach(presetId => {
          jobs.push({
            id: `${product.handle}-${presetId}-${primaryRef}`,
            productHandle: product.handle,
            referenceId: primaryRef,
            presetId,
            status: "pending"
          });
        });
      });

    setBatchJobs(jobs);
    setSelectedJobs(jobs.map(j => j.id));
  };

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const runBatchGeneration = async () => {
    const jobsToRun = batchJobs.filter(j => selectedJobs.includes(j.id));
    if (jobsToRun.length === 0) {
      toast.error("No jobs selected");
      return;
    }

    setIsBatchRunning(true);
    const results: { handle: string; preset: string; url: string }[] = [];

    for (const job of jobsToRun) {
      setBatchJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, status: "processing" } : j
      ));

      try {
        const reference = REFERENCE_IMAGES.find(r => r.id === job.referenceId);
        const preset = GENERATION_PRESETS.find(p => p.id === job.presetId);
        
        if (!reference || !preset) {
          throw new Error("Reference or preset not found");
        }

        // Convert local image to base64
        const imageBase64 = await imageToBase64(reference.url);

        const { data, error } = await supabase.functions.invoke('generate-product-image', {
          body: {
            imageBase64,
            prompt: preset.prompt,
            productHandle: job.productHandle,
            imageType: job.presetId
          }
        });

        if (error) throw error;
        if (data.error) throw new Error(data.error);

        setBatchJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: "complete", outputUrl: data.url } : j
        ));

        results.push({
          handle: job.productHandle,
          preset: job.presetId,
          url: data.url
        });

        toast.success(`Generated: ${job.productHandle} - ${job.presetId}`);

        // Rate limit protection - wait 2s between generations
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error generating ${job.id}:`, error);
        setBatchJobs(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: "error", error: error instanceof Error ? error.message : "Unknown error" } : j
        ));
      }
    }

    // Generate catalog code snippet
    if (results.length > 0) {
      const codeSnippet = generateCatalogCode(results);
      setCatalogCode(codeSnippet);
    }

    setIsBatchRunning(false);
    toast.success(`Batch complete: ${results.length}/${jobsToRun.length} succeeded`);
  };

  const generateCatalogCode = (results: { handle: string; preset: string; url: string }[]) => {
    const byProduct: Record<string, string[]> = {};
    
    results.forEach(r => {
      if (!byProduct[r.handle]) byProduct[r.handle] = [];
      byProduct[r.handle].push(`  { src: "${r.url}", width: 1024, height: 1024, alt: "${r.handle} ${r.preset}" },`);
    });

    let code = "// Generated images for lovableCatalog.ts\n\n";
    
    Object.entries(byProduct).forEach(([handle, images]) => {
      code += `// ${handle} gallery additions:\n`;
      code += images.join("\n");
      code += "\n\n";
    });

    return code;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-headline text-4xl md:text-5xl text-foreground">
              AI Image Generator
            </h1>
            <p className="font-body text-muted-foreground mt-2">
              Generate branded product images using AI with Dandle styling
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Batch Mode</span>
            <Checkbox 
              checked={batchMode} 
              onCheckedChange={(checked) => {
                setBatchMode(!!checked);
                if (checked) buildBatchQueue();
              }}
            />
          </div>
        </div>

        {!batchMode ? (
          /* Single Generation Mode */
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedProduct} onValueChange={(v) => {
                    setSelectedProduct(v);
                    setSelectedReference("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose product" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCT_PRIORITIES.filter(p => p.priority !== "skip").map(product => (
                        <SelectItem key={product.handle} value={product.handle}>
                          <div className="flex items-center gap-2">
                            {product.name}
                            <Badge variant={product.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                              {product.priority}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {selectedProduct && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reference Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {getProductReferences(selectedProduct).map(ref => (
                        <button
                          key={ref.id}
                          onClick={() => setSelectedReference(ref.id)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedReference === ref.id 
                              ? "border-primary ring-2 ring-primary/20" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <img src={ref.url} alt={ref.description} className="w-full h-full object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                            <span className="text-xs text-white">{ref.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Generation Preset</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose style preset" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENERATION_PRESETS.map(preset => (
                        <SelectItem key={preset.id} value={preset.id}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedPreset && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <p className="text-xs text-muted-foreground">
                        {GENERATION_PRESETS.find(p => p.id === selectedPreset)?.prompt.slice(0, 150)}...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Prompt (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Override preset with custom prompt..."
                    className="min-h-[100px]"
                  />
                </CardContent>
              </Card>

              <Button
                onClick={handleSingleGenerate}
                disabled={isGenerating || !selectedProduct || !selectedPreset || !selectedReference}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedImageUrl ? (
                    <div className="space-y-4">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated" 
                        className="w-full rounded-md border border-border"
                      />
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-xs text-muted-foreground mb-1">Storage URL:</p>
                        <code className="text-xs break-all block">{generatedImageUrl}</code>
                      </div>
                      <p className="text-sm text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Saved to Supabase Storage
                      </p>
                    </div>
                  ) : selectedReference ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Reference:</p>
                      <img 
                        src={REFERENCE_IMAGES.find(r => r.id === selectedReference)?.url} 
                        alt="Reference" 
                        className="w-full rounded-md border border-border"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">Select reference image</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Batch Generation Mode */
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generation Queue</CardTitle>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedJobs(batchJobs.map(j => j.id))}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedJobs([])}
                  >
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {batchJobs.map(job => {
                    const product = PRODUCT_PRIORITIES.find(p => p.handle === job.productHandle);
                    const preset = GENERATION_PRESETS.find(p => p.id === job.presetId);
                    
                    return (
                      <div 
                        key={job.id}
                        className={`flex items-center justify-between p-3 rounded-md border ${
                          job.status === "complete" ? "bg-green-50 border-green-200" :
                          job.status === "error" ? "bg-red-50 border-red-200" :
                          job.status === "processing" ? "bg-blue-50 border-blue-200" :
                          "bg-background border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={selectedJobs.includes(job.id)}
                            onCheckedChange={() => toggleJobSelection(job.id)}
                            disabled={isBatchRunning}
                          />
                          <div>
                            <span className="font-medium">{product?.name}</span>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span className="text-sm">{preset?.label}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {job.status === "pending" && <Badge variant="secondary">Pending</Badge>}
                          {job.status === "processing" && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                          {job.status === "complete" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {job.status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={runBatchGeneration}
                disabled={isBatchRunning || selectedJobs.length === 0}
                size="lg"
              >
                {isBatchRunning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Batch...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run {selectedJobs.length} Jobs
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground self-center">
                ~{selectedJobs.length * 15}s estimated ({selectedJobs.length} × 15s each with rate limiting)
              </p>
            </div>

            {catalogCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Catalog Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-xs">
                    {catalogCode}
                  </pre>
                  <Button 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => {
                      navigator.clipboard.writeText(catalogCode);
                      toast.success("Copied to clipboard!");
                    }}
                  >
                    Copy Code
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default GenerateImages;
