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

// Reference images from compressed batch (hosted on Replit)
const REFERENCE_BASE_URL = "https://53ba442d-0103-4dbc-a0d5-4cfe858dc7bb-00-1jrlt3i06lbw7.picard.replit.dev/products";

interface ReferenceImage {
  id: string;
  url: string;
  product: string;
  handle: string;
  description: string;
}

const REFERENCE_IMAGES: ReferenceImage[] = [
  { id: "01", url: `${REFERENCE_BASE_URL}/01.webp`, product: "RelaxMax", handle: "relaxmax", description: "Manual variant" },
  { id: "02", url: `${REFERENCE_BASE_URL}/02.webp`, product: "RelaxMax", handle: "relaxmax", description: "Power variant" },
  { id: "03", url: `${REFERENCE_BASE_URL}/03.webp`, product: "Diva", handle: "diva", description: "Manual red" },
  { id: "04", url: `${REFERENCE_BASE_URL}/04.webp`, product: "Diva", handle: "diva", description: "Power variant" },
  { id: "05", url: `${REFERENCE_BASE_URL}/05.webp`, product: "Diva", handle: "diva", description: "Angle shot" },
  { id: "06", url: `${REFERENCE_BASE_URL}/06.webp`, product: "ComfortPlus", handle: "comfortplus", description: "Manual variant" },
  { id: "07", url: `${REFERENCE_BASE_URL}/07.webp`, product: "ComfortPlus", handle: "comfortplus", description: "Power variant" },
  { id: "08", url: `${REFERENCE_BASE_URL}/08.webp`, product: "CozyCompanion", handle: "cozycompanion", description: "Beige front" },
  { id: "09", url: `${REFERENCE_BASE_URL}/09.webp`, product: "CozyCompanion", handle: "cozycompanion", description: "Yellow variant" },
  { id: "10", url: `${REFERENCE_BASE_URL}/10.webp`, product: "EasyUp", handle: "easyup", description: "Standard lift" },
  { id: "11", url: `${REFERENCE_BASE_URL}/11.webp`, product: "EasyUp Compact", handle: "easyup-compact", description: "Compact lift" },
  { id: "12", url: `${REFERENCE_BASE_URL}/12.webp`, product: "WorkNest", handle: "worknest", description: "Coming soon" },
  { id: "13", url: `${REFERENCE_BASE_URL}/13.webp`, product: "SpaceSaver", handle: "spacesaver", description: "Variant 1" },
  { id: "14", url: `${REFERENCE_BASE_URL}/14.webp`, product: "SpaceSaver", handle: "spacesaver", description: "Variant 2" },
  { id: "15", url: `${REFERENCE_BASE_URL}/15.webp`, product: "Complete Set", handle: "complete-set", description: "Classic setup" },
  { id: "16", url: `${REFERENCE_BASE_URL}/16.webp`, product: "Complete Set", handle: "complete-set", description: "Coastal modern" },
  { id: "17", url: `${REFERENCE_BASE_URL}/17.webp`, product: "Complete Set", handle: "complete-set", description: "Family modern" },
];

// Generation presets with brand-consistent prompts
const GENERATION_PRESETS = [
  {
    id: "lifestyle-day",
    label: "Lifestyle Day",
    prompt: "Transform this recliner into a lifestyle scene: Modern Egyptian penthouse apartment, warm natural sunlight streaming through floor-to-ceiling windows overlooking Cairo, Mediterranean indoor plants, neutral cream and beige palette with bronze accents. Subtle champagne-gold DANDLE watermark in bottom right corner. Quiet luxury aesthetic, aspirational but understated. Ultra high resolution.",
  },
  {
    id: "lifestyle-night",
    label: "Lifestyle Night", 
    prompt: "Transform this recliner into an evening scene: Luxurious Egyptian living room at golden hour, warm ambient lighting from designer lamps, soft shadows, cozy atmosphere with a cup of tea on side table. Rich warm tones, bronze and champagne accents. Subtle champagne-gold DANDLE watermark in bottom right corner. Quiet luxury aesthetic. Ultra high resolution.",
  },
  {
    id: "reclined-view",
    label: "Reclined Position",
    prompt: "Show this recliner in fully reclined position: Same chair design but extended footrest visible, backrest reclined to relaxation angle. Clean studio background with soft gradient, professional product photography lighting. Subtle champagne-gold DANDLE watermark. Ultra high resolution.",
  },
  {
    id: "angle-side",
    label: "Side Angle",
    prompt: "Show this recliner from a 45-degree side profile angle: Emphasize the elegant silhouette and premium craftsmanship details. Clean neutral background, professional studio lighting with soft shadows. Subtle champagne-gold DANDLE watermark. Ultra high resolution.",
  },
  {
    id: "detail-texture",
    label: "Detail Texture",
    prompt: "Close-up macro shot of this recliner's upholstery: Show premium leather or fabric texture, stitching details, armrest craftsmanship. Shallow depth of field, professional product photography. Emphasize quality materials. Subtle champagne-gold DANDLE watermark. Ultra high resolution.",
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
  { handle: "comfortplus", name: "ComfortPlus", priority: "high", referenceIds: ["06", "07"], presetsToGenerate: ["lifestyle-day", "lifestyle-night", "reclined-view", "angle-side"] },
  { handle: "diva", name: "Diva", priority: "high", referenceIds: ["03", "04", "05"], presetsToGenerate: ["lifestyle-day", "lifestyle-night", "angle-side"] },
  { handle: "cozycompanion", name: "CozyCompanion", priority: "high", referenceIds: ["08", "09"], presetsToGenerate: ["lifestyle-day", "angle-side"] },
  { handle: "relaxmax", name: "RelaxMax", priority: "medium", referenceIds: ["01", "02"], presetsToGenerate: ["lifestyle-night"] },
  { handle: "easyup", name: "EasyUp", priority: "medium", referenceIds: ["10"], presetsToGenerate: ["lifestyle-day"] },
  { handle: "easyup-compact", name: "EasyUp Compact", priority: "medium", referenceIds: ["11"], presetsToGenerate: ["lifestyle-day"] },
  { handle: "complete-set", name: "Complete Set", priority: "medium", referenceIds: ["15", "16", "17"], presetsToGenerate: [] },
  { handle: "worknest", name: "WorkNest", priority: "skip", referenceIds: ["12"], presetsToGenerate: [] },
  { handle: "spacesaver", name: "SpaceSaver", priority: "skip", referenceIds: ["13", "14"], presetsToGenerate: [] },
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

      const { data, error } = await supabase.functions.invoke('generate-product-image', {
        body: {
          referenceImageUrl: reference.url,
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

        const { data, error } = await supabase.functions.invoke('generate-product-image', {
          body: {
            referenceImageUrl: reference.url,
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
