import { Clock, Shield, Package, Sparkles } from "lucide-react";

interface ProductMetafieldsProps {
  metafields: {
    leadTime?: string;
    warranty?: string;
    capacity?: string;
    madeIn?: string;
    mechanismOrigin?: string;
    frameWood?: string;
    foamType?: string;
    features?: string[];
  };
}

export const ProductMetafields = ({ metafields }: ProductMetafieldsProps) => {
  const hasProductionInfo = metafields.leadTime || metafields.madeIn || metafields.capacity;
  const hasSpecs = metafields.mechanismOrigin || metafields.frameWood || metafields.foamType;
  
  if (!hasProductionInfo && !hasSpecs && !metafields.warranty) {
    return null;
  }

  return (
    <div className="space-y-6 pt-6 border-t border-border">
      {/* Production & Delivery */}
      {hasProductionInfo && (
        <div>
          <h3 className="font-headline text-lg mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Production & Delivery
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {metafields.leadTime && (
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground font-body">Lead Time</p>
                <p className="font-medium">{metafields.leadTime} days</p>
              </div>
            )}
            {metafields.madeIn && (
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground font-body">Made In</p>
                <p className="font-medium">{metafields.madeIn}</p>
              </div>
            )}
            {metafields.capacity && (
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground font-body">Weekly Capacity</p>
                <p className="font-medium">{metafields.capacity} units</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warranty */}
      {metafields.warranty && (
        <div>
          <h3 className="font-headline text-lg mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Warranty
          </h3>
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="font-medium">{metafields.warranty} Year Warranty</p>
            <p className="text-sm text-muted-foreground font-body mt-1">
              Full coverage on frame, mechanism, and upholstery
            </p>
          </div>
        </div>
      )}

      {/* Specifications */}
      {hasSpecs && (
        <div>
          <h3 className="font-headline text-lg mb-3 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Specifications
          </h3>
          <div className="space-y-2">
            {metafields.mechanismOrigin && (
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground font-body">Mechanism Origin</span>
                <span className="font-medium">{metafields.mechanismOrigin}</span>
              </div>
            )}
            {metafields.frameWood && (
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground font-body">Frame Material</span>
                <span className="font-medium">{metafields.frameWood}</span>
              </div>
            )}
            {metafields.foamType && (
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground font-body">Foam Type</span>
                <span className="font-medium">{metafields.foamType}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features */}
      {metafields.features && metafields.features.length > 0 && (
        <div>
          <h3 className="font-headline text-lg mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Features
          </h3>
          <div className="flex flex-wrap gap-2">
            {metafields.features.map((feature, index) => (
              <span 
                key={index} 
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-body"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMetafields;
