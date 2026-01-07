import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import JSZip from "jszip";
import { 
  Image, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Eye,
  Wand2,
  Home,
  Building2,
  Briefcase,
  Gift,
  Camera,
  Archive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { 
  siteImageManifest, 
  SiteImage, 
  ImageCategory,
  getImagesByCategory,
  getMissingImages,
  getExistingImages,
  manifestStats
} from "@/data/siteImageManifest";

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

interface ImageState extends SiteImage {
  generationStatus: GenerationStatus;
  localGeneratedUrl?: string;
  error?: string;
}

const categoryIcons: Record<ImageCategory, React.ReactNode> = {
  'product-hero': <Image className="w-4 h-4" />,
  'product-gallery': <Camera className="w-4 h-4" />,
  'lifestyle-home': <Home className="w-4 h-4" />,
  'lifestyle-hotel': <Building2 className="w-4 h-4" />,
  'lifestyle-office': <Briefcase className="w-4 h-4" />,
  'gift-campaign': <Gift className="w-4 h-4" />,
  'detail-macro': <Camera className="w-4 h-4" />,
};

const categoryLabels: Record<ImageCategory, string> = {
  'product-hero': 'Product Heroes',
  'product-gallery': 'Product Gallery',
  'lifestyle-home': 'Home Lifestyle',
  'lifestyle-hotel': 'Hotel Settings',
  'lifestyle-office': 'Office Settings',
  'gift-campaign': 'Gift Campaign',
  'detail-macro': 'Detail Shots',
};

const GenerateSiteImages = () => {
  const [images, setImages] = useState<ImageState[]>(
    siteImageManifest.map(img => ({ ...img, generationStatus: 'idle' }))
  );
  const [selectedImage, setSelectedImage] = useState<ImageState | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [batchGenerating, setBatchGenerating] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [activeCategory, setActiveCategory] = useState<ImageCategory>('product-hero');

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

  const generateSingleImage = useCallback(async (imageId: string) => {
    const imageIndex = images.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return;

    const image = images[imageIndex];
    
    setImages(prev => prev.map((img, i) => 
      i === imageIndex ? { ...img, generationStatus: 'generating' } : img
    ));

    try {
      // Convert reference image to base64
      const base64Image = await imageToBase64(image.referenceUrl);
      
      const { data, error } = await supabase.functions.invoke('generate-site-image', {
        body: {
          referenceImage: base64Image,
          prompt: image.prompt,
          filename: image.filename,
          dimensions: image.dimensions,
          category: image.category,
          productHandle: image.productHandle,
        }
      });

      if (error) throw error;

      setImages(prev => prev.map((img, i) => 
        i === imageIndex ? { 
          ...img, 
          generationStatus: 'success',
          localGeneratedUrl: data.imageUrl,
          status: 'exists',
        } : img
      ));

      toast.success(`Generated: ${image.filename}`);
    } catch (error) {
      console.error('Generation error:', error);
      setImages(prev => prev.map((img, i) => 
        i === imageIndex ? { 
          ...img, 
          generationStatus: 'error',
          error: error instanceof Error ? error.message : 'Generation failed',
        } : img
      ));
      toast.error(`Failed: ${image.filename}`);
    }
  }, [images]);

  const generateMissingImages = useCallback(async () => {
    const missingImages = images.filter(img => img.status === 'missing');
    if (missingImages.length === 0) {
      toast.info('All images already exist!');
      return;
    }

    setBatchGenerating(true);
    setBatchProgress(0);

    for (let i = 0; i < missingImages.length; i++) {
      await generateSingleImage(missingImages[i].id);
      setBatchProgress(((i + 1) / missingImages.length) * 100);
      // Add delay to avoid rate limiting
      if (i < missingImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    setBatchGenerating(false);
    toast.success('Batch generation complete!');
  }, [images, generateSingleImage]);

  const downloadAllAsZip = useCallback(async () => {
    const generatedImages = images.filter(
      img => img.status === 'exists' || img.localGeneratedUrl || img.generatedUrl
    );
    
    if (generatedImages.length === 0) {
      toast.error('No generated images to download');
      return;
    }

    toast.info(`Preparing ZIP with ${generatedImages.length} images...`);
    
    const zip = new JSZip();
    let successCount = 0;

    for (const image of generatedImages) {
      const imageUrl = image.localGeneratedUrl || image.generatedUrl;
      if (!imageUrl) continue;

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) continue;
        
        const blob = await response.blob();
        const folderPath = `${image.category}/${image.filename}`;
        zip.file(folderPath, blob);
        successCount++;
      } catch (err) {
        console.warn(`Failed to fetch ${image.filename}:`, err);
      }
    }

    if (successCount === 0) {
      toast.error('Could not fetch any images');
      return;
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dandle-site-images-${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success(`Downloaded ${successCount} images as ZIP`);
  }, [images]);

  const openPreview = (image: ImageState) => {
    setSelectedImage(image);
    setPreviewOpen(true);
  };

  const getStatusBadge = (image: ImageState) => {
    if (image.generationStatus === 'generating') {
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Generating</Badge>;
    }
    if (image.generationStatus === 'success' || image.status === 'exists') {
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500"><CheckCircle className="w-3 h-3 mr-1" />Ready</Badge>;
    }
    if (image.generationStatus === 'error') {
      return <Badge variant="outline" className="bg-red-500/10 text-red-500"><XCircle className="w-3 h-3 mr-1" />Error</Badge>;
    }
    return <Badge variant="outline" className="bg-muted">Missing</Badge>;
  };

  const categoryImages = images.filter(img => img.category === activeCategory);
  const missingCount = images.filter(img => img.status === 'missing').length;
  const existingCount = images.filter(img => img.status === 'exists').length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{manifestStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Images</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-emerald-500">{existingCount}</div>
            <div className="text-sm text-muted-foreground">Existing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-500">{missingCount}</div>
            <div className="text-sm text-muted-foreground">Missing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <Progress value={(existingCount / manifestStats.total) * 100} className="h-2 mb-2" />
            <div className="text-sm text-muted-foreground">
              {Math.round((existingCount / manifestStats.total) * 100)}% Complete
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg">Batch Generation</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={downloadAllAsZip}
              disabled={batchGenerating || existingCount === 0}
            >
              <Archive className="w-4 h-4 mr-2" />
              Download ZIP ({existingCount})
            </Button>
            <Button 
              onClick={generateMissingImages}
              disabled={batchGenerating || missingCount === 0}
              className="bg-dandle-orange hover:bg-dandle-orange/90"
            >
              {batchGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating ({Math.round(batchProgress)}%)
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate All Missing ({missingCount})
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        {batchGenerating && (
          <CardContent className="pt-0">
            <Progress value={batchProgress} className="h-2" />
          </CardContent>
        )}
      </Card>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as ImageCategory)}>
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-1">
          {(Object.keys(categoryLabels) as ImageCategory[]).map(category => (
            <TabsTrigger key={category} value={category} className="text-xs px-2">
              {categoryIcons[category]}
              <span className="hidden md:inline ml-1">{categoryLabels[category]}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {manifestStats.byCategory[category]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryImages.map(image => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  <img
                    src={image.localGeneratedUrl || image.generatedUrl || image.referenceUrl}
                    alt={image.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(image)}
                  </div>
                  {image.generationStatus === 'generating' && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-dandle-orange" />
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-medium text-sm truncate">{image.product}</h4>
                      <p className="text-xs text-muted-foreground truncate">{image.setting}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openPreview(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {image.status === 'missing' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => generateSingleImage(image.id)}
                          disabled={image.generationStatus === 'generating'}
                        >
                          {image.generationStatus === 'generating' ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      {(image.localGeneratedUrl || image.generatedUrl) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => generateSingleImage(image.id)}
                          disabled={image.generationStatus === 'generating'}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {image.dimensions.width}×{image.dimensions.height} • {image.aspectRatio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedImage?.product} - {selectedImage?.setting}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            {selectedImage && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Reference Image</h4>
                    <img
                      src={selectedImage.referenceUrl}
                      alt="Reference"
                      className="w-full rounded-lg border"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Generated Image</h4>
                    {selectedImage.localGeneratedUrl || selectedImage.generatedUrl ? (
                      <img
                        src={selectedImage.localGeneratedUrl || selectedImage.generatedUrl}
                        alt="Generated"
                        className="w-full rounded-lg border"
                      />
                    ) : (
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">Not generated yet</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Prompt</h4>
                  <p className="text-xs text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedImage.prompt}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Filename:</span>
                    <p className="font-mono text-xs">{selectedImage.filename}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dimensions:</span>
                    <p>{selectedImage.dimensions.width}×{selectedImage.dimensions.height}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Category:</span>
                    <p>{categoryLabels[selectedImage.category]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="mt-1">{getStatusBadge(selectedImage)}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => generateSingleImage(selectedImage.id)}
                    disabled={selectedImage.generationStatus === 'generating'}
                    className="bg-dandle-orange hover:bg-dandle-orange/90"
                  >
                    {selectedImage.generationStatus === 'generating' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4 mr-2" />
                    )}
                    {selectedImage.status === 'exists' ? 'Regenerate' : 'Generate'}
                  </Button>
                  {(selectedImage.localGeneratedUrl || selectedImage.generatedUrl) && (
                    <Button variant="outline" asChild>
                      <a 
                        href={selectedImage.localGeneratedUrl || selectedImage.generatedUrl} 
                        download={selectedImage.filename}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GenerateSiteImages;
