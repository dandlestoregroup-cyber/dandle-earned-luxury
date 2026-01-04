import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const WHATSAPP_NUMBER = "201222804255";

interface ReclinerId {
  id: string;
  name: string;
  handle: string;
  widthCm: number;
  depthClosedCm: number;
  depthOpenCm: number;
}

const recliners: ReclinerId[] = [
  { id: "relaxmax", name: "RelaxMax", handle: "relaxmax", widthCm: 85, depthClosedCm: 95, depthOpenCm: 165 },
  { id: "spacesaver", name: "SpaceSaver", handle: "spacesaver", widthCm: 80, depthClosedCm: 85, depthOpenCm: 145 },
  { id: "worknest", name: "WorkNest", handle: "worknest", widthCm: 75, depthClosedCm: 90, depthOpenCm: 155 },
  { id: "diva", name: "Diva", handle: "diva", widthCm: 90, depthClosedCm: 100, depthOpenCm: 170 },
  { id: "comfortplus", name: "ComfortPlus", handle: "comfortplus", widthCm: 95, depthClosedCm: 105, depthOpenCm: 175 },
  { id: "cozycompanion", name: "CozyCompanion", handle: "cozycompanion", widthCm: 145, depthClosedCm: 100, depthOpenCm: 175 },
  { id: "easyup-standard", name: "EasyUp Standard", handle: "easyup-standard", widthCm: 85, depthClosedCm: 95, depthOpenCm: 165 },
  { id: "easyup-compact", name: "EasyUp Compact", handle: "easyup-compact", widthCm: 75, depthClosedCm: 85, depthOpenCm: 150 },
];

const RoomFit = () => {
  const navigate = useNavigate();
  const [widthM, setWidthM] = useState("");
  const [depthM, setDepthM] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  const widthCm = parseFloat(widthM) * 100 || 0;
  const depthCm = parseFloat(depthM) * 100 || 0;

  const checkFit = (recliner: ReclinerId): "fits" | "tight" | "no" => {
    if (widthCm === 0 || depthCm === 0) return "no";
    
    const widthMargin = widthCm - recliner.widthCm;
    const depthMargin = depthCm - recliner.depthOpenCm;
    
    if (widthMargin >= 20 && depthMargin >= 20) return "fits";
    if (widthMargin >= 0 && depthMargin >= 0) return "tight";
    return "no";
  };

  const handleCheck = () => {
    setHasChecked(true);
  };

  const handleWhatsAppInquiry = (recliner: ReclinerId) => {
    const message = encodeURIComponent(
      `Room Fit Inquiry\n\nSpace Dimensions: ${widthM}m × ${depthM}m\nModel: ${recliner.name}\n\nI'd like to confirm if this fits my space.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
  };

  const fittingRecliners = hasChecked ? recliners.filter(r => checkFit(r) !== "no") : [];

  return (
    <>
      <Helmet>
        <title>Room & Space Fit | Dandle</title>
        <meta name="description" content="Check which Dandle recliner fits your space. Enter your room dimensions and instantly see compatible models." />
      </Helmet>
      
      <Navigation />
      
      <main className="min-h-screen bg-cream-porcelain pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Ruler className="w-12 h-12 text-dandle-orange mx-auto mb-4" />
            <h1 
              className="font-headline text-3xl md:text-4xl text-charcoal mb-2"
              data-en="Room & Space Fit"
              data-ar="مقاس الركن"
            >
              Room & Space Fit
            </h1>
            <p 
              className="text-charcoal/60"
              data-en="Enter your space dimensions to find compatible recliners"
              data-ar="أدخل أبعاد المساحة لمعرفة الكراسي المناسبة"
            >
              Enter your space dimensions to find compatible recliners
            </p>
          </motion.div>

          {/* Dimension Input */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-lg border border-charcoal/5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 
              className="font-headline text-xl text-charcoal mb-6"
              data-en="Your Available Space"
              data-ar="المساحة المتاحة"
            >
              Your Available Space
            </h2>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <Label 
                  htmlFor="width" 
                  className="text-charcoal/70 mb-2 block"
                  data-en="Width (meters)"
                  data-ar="العرض (متر)"
                >
                  Width (meters)
                </Label>
                <Input
                  id="width"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 1.5"
                  value={widthM}
                  onChange={(e) => {
                    setWidthM(e.target.value);
                    setHasChecked(false);
                  }}
                  className="text-lg"
                />
              </div>
              <div>
                <Label 
                  htmlFor="depth" 
                  className="text-charcoal/70 mb-2 block"
                  data-en="Depth (meters)"
                  data-ar="العمق (متر)"
                >
                  Depth (meters)
                </Label>
                <Input
                  id="depth"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="e.g. 2.0"
                  value={depthM}
                  onChange={(e) => {
                    setDepthM(e.target.value);
                    setHasChecked(false);
                  }}
                  className="text-lg"
                />
              </div>
            </div>

            <Button
              onClick={handleCheck}
              disabled={!widthM || !depthM}
              className="w-full bg-dandle-orange hover:bg-dandle-orange/90 text-white py-6 text-lg"
            >
              <span data-en="Check Fit" data-ar="تحقق من المقاس">Check Fit</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Results */}
          {hasChecked && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 
                className="font-headline text-xl text-charcoal mb-4"
                data-en="Compatible Recliners"
                data-ar="الكراسي المناسبة"
              >
                Compatible Recliners
              </h2>
              
              {fittingRecliners.length === 0 ? (
                <div className="bg-white rounded-xl p-6 border border-charcoal/5 text-center">
                  <X className="w-10 h-10 text-red-400 mx-auto mb-3" />
                  <p 
                    className="text-charcoal/70"
                    data-en="No recliners fit this space when fully reclined. Consider a larger area or contact us for alternatives."
                    data-ar="لا توجد كراسي تناسب هذه المساحة عند فتحها بالكامل. جرب مساحة أكبر أو تواصل معنا."
                  >
                    No recliners fit this space when fully reclined. Consider a larger area or contact us for alternatives.
                  </p>
                </div>
              ) : (
                fittingRecliners.map((recliner) => {
                  const fitStatus = checkFit(recliner);
                  return (
                    <div
                      key={recliner.id}
                      className="bg-white rounded-xl p-6 border border-charcoal/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          fitStatus === "fits" ? "bg-green-100" : "bg-yellow-100"
                        }`}>
                          <Check className={`w-5 h-5 ${
                            fitStatus === "fits" ? "text-green-600" : "text-yellow-600"
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-headline text-lg text-charcoal">{recliner.name}</h3>
                          <p className="text-sm text-charcoal/50">
                            {recliner.widthCm}cm × {recliner.depthOpenCm}cm 
                            {fitStatus === "tight" && (
                              <span 
                                className="text-yellow-600 ml-2"
                                data-en="(Tight fit)"
                                data-ar="(مساحة ضيقة)"
                              >
                                (Tight fit)
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/products/${recliner.handle}`)}
                        >
                          <span data-en="View" data-ar="عرض">View</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleWhatsAppInquiry(recliner)}
                          className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                        >
                          <span data-en="Inquire" data-ar="استفسار">Inquire</span>
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* Tip */}
          <motion.div
            className="mt-10 p-6 bg-dandle-orange/5 rounded-xl border border-dandle-orange/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p 
              className="text-sm text-charcoal/70"
              data-en="💡 Tip: Measure from the wall to any obstacle in front. Recliners need extra depth when fully extended."
              data-ar="💡 نصيحة: قيس من الحائط لأي عائق أمامك. الكراسي تحتاج عمق إضافي عند فتحها بالكامل."
            >
              💡 Tip: Measure from the wall to any obstacle in front. Recliners need extra depth when fully extended.
            </p>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default RoomFit;
