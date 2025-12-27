import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Check } from "lucide-react";

interface RoleApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RoleApplicationModal = ({ open, onOpenChange }: RoleApplicationModalProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    proficiency: "",
    bestTool: "",
    yearsExperience: "",
    linkedin: "",
    answer1: "",
    answer2: "",
    answer3: "",
    consent: false,
  });
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const isFormValid = () => {
    return (
      formData.fullName &&
      formData.phone &&
      formData.email &&
      formData.city &&
      formData.proficiency &&
      formData.bestTool &&
      formData.yearsExperience &&
      formData.answer1 &&
      formData.answer2 &&
      formData.answer3 &&
      formData.consent &&
      cvFile
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload CV to Supabase Storage
      let cvUrl = "";
      if (cvFile) {
        const fileName = `careers/role-applications/${Date.now()}-${cvFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, cvFile);

        if (uploadError) {
          throw new Error("Failed to upload CV");
        }

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        cvUrl = urlData.publicUrl;
      }

      // Send application via edge function
      const { error } = await supabase.functions.invoke("submit-career-application", {
        body: {
          type: "role",
          role: "Executive Assistant",
          ...formData,
          cvUrl,
        },
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset form after close animation
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        city: "",
        proficiency: "",
        bestTool: "",
        yearsExperience: "",
        linkedin: "",
        answer1: "",
        answer2: "",
        answer3: "",
        consent: false,
      });
      setCvFile(null);
    }, 300);
  };

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-headline text-2xl font-bold text-charcoal mb-4">Received.</h3>
            <p className="text-muted-foreground">
              If shortlisted, we'll contact you.<br />
              We move fast, quiet, and fair.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Apply for Executive Assistant
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">City/Area *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Arabic/English Proficiency *</Label>
              <Select
                value={formData.proficiency}
                onValueChange={(val) => handleInputChange("proficiency", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fluent-both">Fluent in both</SelectItem>
                  <SelectItem value="arabic-english-conversational">
                    Arabic native / English conversational
                  </SelectItem>
                  <SelectItem value="arabic-english-basic">
                    Arabic native / English basic
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Best Tool *</Label>
              <Select
                value={formData.bestTool}
                onValueChange={(val) => handleInputChange("bestTool", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tool" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notion">Notion</SelectItem>
                  <SelectItem value="excel-sheets">Excel/Google Sheets</SelectItem>
                  <SelectItem value="whatsapp-business">WhatsApp Business</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years">Years of Experience *</Label>
              <Input
                id="years"
                type="number"
                min="0"
                value={formData.yearsExperience}
                onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedin}
                onChange={(e) => handleInputChange("linkedin", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cv">CV Upload * (PDF, DOC, DOCX)</Label>
            <Input
              id="cv"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="answer1">
              Your proudest 'mess → system' story (5–8 lines) *
            </Label>
            <Textarea
              id="answer1"
              rows={5}
              value={formData.answer1}
              onChange={(e) => handleInputChange("answer1", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="answer2">
              One thing you want to master next (3–5 lines) *
            </Label>
            <Textarea
              id="answer2"
              rows={4}
              value={formData.answer2}
              onChange={(e) => handleInputChange("answer2", e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="answer3">Why Dandle? (3–5 lines) *</Label>
            <Textarea
              id="answer3"
              rows={4}
              value={formData.answer3}
              onChange={(e) => handleInputChange("answer3", e.target.value)}
              required
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) =>
                handleInputChange("consent", checked === true)
              }
            />
            <Label htmlFor="consent" className="text-sm cursor-pointer">
              I confirm my information is accurate. *
            </Label>
          </div>

          <Button
            type="submit"
            disabled={!isFormValid() || loading}
            className="w-full h-14 bg-charcoal text-warm-white hover:bg-charcoal/90 rounded-sm font-body text-lg"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleApplicationModal;
