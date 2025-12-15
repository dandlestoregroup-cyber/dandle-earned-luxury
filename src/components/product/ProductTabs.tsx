import { useState } from "react";
import { Star, Package, FileText, Truck, MessageSquare } from "lucide-react";
import { ProductDetail } from "@/data/productDetails";

interface ProductTabsProps {
  product: ProductDetail;
}

type TabId = 'overview' | 'specs' | 'warranty' | 'delivery' | 'reviews';

export const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: Package },
    { id: 'specs' as TabId, label: 'Specifications', icon: FileText },
    { id: 'warranty' as TabId, label: 'Warranty & Care', icon: Star },
    { id: 'delivery' as TabId, label: 'Delivery', icon: Truck },
    { id: 'reviews' as TabId, label: `Reviews (${product.reviewCount})`, icon: MessageSquare },
  ];

  return (
    <div className="mt-12 border-t border-border pt-8">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto scrollbar-hide border-b border-border -mx-4 px-4 md:mx-0 md:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
              border-b-2 transition-all duration-200
              ${activeTab === tab.id 
                ? 'border-bronze text-bronze' 
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'overview' && <OverviewTab product={product} />}
        {activeTab === 'specs' && <SpecsTab product={product} />}
        {activeTab === 'warranty' && <WarrantyTab warrantyYears={product.warrantyYears} />}
        {activeTab === 'delivery' && <DeliveryTab leadTime={product.leadTimeWeeks} />}
        {activeTab === 'reviews' && <ReviewsTab reviews={product.reviews} rating={product.rating} />}
      </div>
    </div>
  );
};

const OverviewTab = ({ product }: { product: ProductDetail }) => (
  <div className="grid md:grid-cols-2 gap-8">
    <div>
      <h3 className="font-headline text-xl mb-4">Key Features</h3>
      <ul className="space-y-3">
        {product.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{feature.icon}</span>
            <span className="text-muted-foreground">{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
    <div>
      <h3 className="font-headline text-xl mb-4">Dimensions</h3>
      <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-border">
            <td className="py-2 text-muted-foreground">Width</td>
            <td className="py-2 text-right font-medium">{product.dimensions.width}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2 text-muted-foreground">Depth</td>
            <td className="py-2 text-right font-medium">{product.dimensions.depth}</td>
          </tr>
          <tr className="border-b border-border">
            <td className="py-2 text-muted-foreground">Height</td>
            <td className="py-2 text-right font-medium">{product.dimensions.height}</td>
          </tr>
          {product.dimensions.reclined && (
            <tr className="border-b border-border">
              <td className="py-2 text-muted-foreground">Reclined Length</td>
              <td className="py-2 text-right font-medium">{product.dimensions.reclined}</td>
            </tr>
          )}
          <tr>
            <td className="py-2 text-muted-foreground">Weight Capacity</td>
            <td className="py-2 text-right font-medium">{product.dimensions.weightCapacity}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const SpecsTab = ({ product }: { product: ProductDetail }) => (
  <div className="max-w-2xl">
    <h3 className="font-headline text-xl mb-4">Technical Specifications</h3>
    <table className="w-full text-sm">
      <tbody>
        <tr className="border-b border-border">
          <td className="py-3 text-muted-foreground">Frame Material</td>
          <td className="py-3 text-right font-medium">{product.specs.frame}</td>
        </tr>
        <tr className="border-b border-border">
          <td className="py-3 text-muted-foreground">Cushion Filling</td>
          <td className="py-3 text-right font-medium">{product.specs.cushion}</td>
        </tr>
        <tr className="border-b border-border">
          <td className="py-3 text-muted-foreground">Upholstery Options</td>
          <td className="py-3 text-right font-medium">{product.specs.upholstery}</td>
        </tr>
        <tr className="border-b border-border">
          <td className="py-3 text-muted-foreground">Mechanism Type</td>
          <td className="py-3 text-right font-medium">{product.specs.mechanism}</td>
        </tr>
        <tr>
          <td className="py-3 text-muted-foreground">Weight Capacity</td>
          <td className="py-3 text-right font-medium">{product.specs.weightCapacity}</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const WarrantyTab = ({ warrantyYears }: { warrantyYears: number }) => (
  <div className="max-w-2xl space-y-6">
    <div>
      <h3 className="font-headline text-xl mb-4">{warrantyYears}-Year Warranty Coverage</h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-foreground mb-2">What's Covered ✓</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Frame structural integrity
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Reclining mechanism defects
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Motor and electrical components (power models)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Fabric/leather manufacturing defects
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Cushion foam degradation beyond normal wear
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-2">Not Covered ✗</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-red-600">✗</span> Normal wear and tear
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✗</span> Accidental damage or misuse
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✗</span> Pet damage
            </li>
            <li className="flex items-center gap-2">
              <span className="text-red-600">✗</span> Unauthorized modifications
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <h4 className="font-medium text-foreground mb-2">Care Instructions</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• <strong>Leather:</strong> Wipe with damp cloth monthly, condition every 6 months</li>
        <li>• <strong>Fabric:</strong> Vacuum weekly, spot-clean spills immediately</li>
        <li>• <strong>General:</strong> Avoid direct sunlight, keep away from heat sources</li>
      </ul>
    </div>
  </div>
);

const DeliveryTab = ({ leadTime }: { leadTime: string }) => (
  <div className="max-w-2xl space-y-6">
    <div>
      <h3 className="font-headline text-xl mb-4">Delivery Information</h3>
      <div className="bg-bronze/5 border border-bronze/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-foreground">
          <strong>Custom Order Timeline:</strong> {leadTime} weeks production + delivery
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-foreground mb-3">Delivery Zones</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex justify-between">
              <span>Greater Cairo & Giza</span>
              <span className="font-medium">2-3 days</span>
            </li>
            <li className="flex justify-between">
              <span>Alexandria</span>
              <span className="font-medium">3-5 days</span>
            </li>
            <li className="flex justify-between">
              <span>Other Governorates</span>
              <span className="font-medium">5-7 days</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-foreground mb-3">What's Included</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Professional 2-person team
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Unpacking & inspection
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Full assembly & placement
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Functionality demonstration
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span> Packaging removal
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const ReviewsTab = ({ reviews, rating }: { reviews: ProductDetail['reviews']; rating: number }) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 pb-6 border-b border-border">
      <div className="text-center">
        <div className="text-4xl font-headline text-foreground">{rating}</div>
        <div className="flex items-center gap-1 justify-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-bronze text-bronze' : 'text-muted-foreground/30'}`} 
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</div>
      </div>
    </div>
    
    <div className="space-y-6">
      {reviews.map((review, index) => (
        <div key={index} className="pb-6 border-b border-border last:border-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-medium text-foreground">{review.name}</span>
              <span className="text-muted-foreground text-sm ml-2">— {review.city}</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < review.rating ? 'fill-bronze text-bronze' : 'text-muted-foreground/30'}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{review.text}</p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {new Date(review.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      ))}
    </div>
    
    <button className="w-full md:w-auto px-6 py-3 border border-bronze text-bronze rounded-lg hover:bg-bronze/5 transition-colors font-medium">
      Write a Review
    </button>
  </div>
);
