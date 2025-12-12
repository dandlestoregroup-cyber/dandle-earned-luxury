import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Loader2, Package, FolderOpen, FileText, Settings, Link2, Database } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExportData {
  export_timestamp: string;
  export_duration_ms: number;
  summary: {
    total_products: number;
    total_variants: number;
    total_collections: number;
    total_draft_orders: number;
    total_metafield_definitions: number;
    total_urls: number;
  };
  shop: Record<string, unknown>;
  products: unknown[];
  products_csv: string;
  collections: unknown[];
  draft_orders: unknown[];
  metafield_definitions: unknown[];
  urls: string[];
}

export default function ExportData() {
  const [loading, setLoading] = useState(false);
  const [exportData, setExportData] = useState<ExportData | null>(null);

  const fetchExportData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('export-store-data');
      
      if (error) throw error;
      
      setExportData(data);
      toast.success(`Export complete! ${data.summary.total_products} products, ${data.summary.total_collections} collections`);
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error('Export failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string = 'application/json') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = (data: unknown, filename: string) => {
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json');
  };

  const downloadCSV = (content: string, filename: string) => {
    downloadFile(content, filename, 'text/csv');
  };

  const downloadTXT = (content: string, filename: string) => {
    downloadFile(content, filename, 'text/plain');
  };

  const downloadAll = () => {
    if (!exportData) return;
    
    // Create a combined export
    const timestamp = new Date().toISOString().split('T')[0];
    
    downloadJSON(exportData.products, `dandle-products-${timestamp}.json`);
    downloadCSV(exportData.products_csv, `dandle-products-${timestamp}.csv`);
    downloadJSON(exportData.collections, `dandle-collections-${timestamp}.json`);
    downloadJSON(exportData.draft_orders, `dandle-draft-orders-${timestamp}.json`);
    downloadJSON(exportData.shop, `dandle-shop-settings-${timestamp}.json`);
    downloadJSON(exportData.metafield_definitions, `dandle-metafield-definitions-${timestamp}.json`);
    downloadTXT(exportData.urls.join('\n'), `dandle-urls-${timestamp}.txt`);
    
    // Full export
    downloadJSON(exportData, `dandle-complete-export-${timestamp}.json`);
    
    toast.success('All files downloaded!');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Data Export</h1>
          <p className="text-muted-foreground mt-2">
            Export all Shopify store data for backup or migration
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Generate Export
            </CardTitle>
            <CardDescription>
              Fetch all data from Shopify Admin API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={fetchExportData} 
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting... This may take a moment
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Complete Export
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {exportData && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Export Summary</CardTitle>
                <CardDescription>
                  Generated at {new Date(exportData.export_timestamp).toLocaleString()} 
                  ({exportData.export_duration_ms}ms)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exportData.summary.total_products}</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exportData.summary.total_variants}</div>
                    <div className="text-sm text-muted-foreground">Variants</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exportData.summary.total_collections}</div>
                    <div className="text-sm text-muted-foreground">Collections</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exportData.summary.total_draft_orders}</div>
                    <div className="text-sm text-muted-foreground">Draft Orders</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exportData.summary.total_metafield_definitions}</div>
                    <div className="text-sm text-muted-foreground">Metafield Definitions</div>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exportData.summary.total_urls}</div>
                    <div className="text-sm text-muted-foreground">URLs</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Files</CardTitle>
                <CardDescription>Download individual data files or everything at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={downloadAll} className="w-full" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Download All Files
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadJSON(exportData.products, 'products.json')}
                    className="justify-start"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    products.json ({exportData.summary.total_products})
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadCSV(exportData.products_csv, 'products.csv')}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    products.csv (spreadsheet)
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadJSON(exportData.collections, 'collections.json')}
                    className="justify-start"
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    collections.json ({exportData.summary.total_collections})
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadJSON(exportData.draft_orders, 'draft_orders.json')}
                    className="justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    draft_orders.json ({exportData.summary.total_draft_orders})
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadJSON(exportData.shop, 'shop.json')}
                    className="justify-start"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    shop.json (settings)
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadJSON(exportData.metafield_definitions, 'metafield_definitions.json')}
                    className="justify-start"
                  >
                    <Database className="mr-2 h-4 w-4" />
                    metafield_definitions.json
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTXT(exportData.urls.join('\n'), 'urls.txt')}
                    className="justify-start"
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    urls.txt ({exportData.summary.total_urls})
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadJSON(exportData, 'complete_export.json')}
                    className="justify-start"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    complete_export.json (all data)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
