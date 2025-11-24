import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";

interface CheckoutFormProps {
  onSubmit: (data: CustomerData) => void;
  onCancel: () => void;
}

export interface CustomerData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  governorate: string;
  notes?: string;
}

const CheckoutForm = ({ onSubmit, onCancel }: CheckoutFormProps) => {
  const { getTotalPrice } = useCart();
  const [formData, setFormData] = useState<CustomerData>({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    governorate: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatPrice = (num: number) => `${num.toLocaleString('en-US')} EGP`;

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      <h2 className="text-2xl font-bold mb-6">Complete Your Order</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-accent">Contact Information</h3>
          
          <div>
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ahmed Mohamed"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+20 1XX XXX XXXX"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="ahmed@example.com"
              className="mt-1"
            />
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-accent">Delivery Address</h3>
          
          <div>
            <Label htmlFor="address">Street Address *</Label>
            <Textarea
              id="address"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Building number, street name, area"
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Cairo"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="governorate">Governorate *</Label>
              <Input
                id="governorate"
                required
                value={formData.governorate}
                onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                placeholder="Cairo"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="pt-4 border-t border-border">
          <Label htmlFor="notes">Additional Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special delivery instructions or preferences..."
            className="mt-1"
            rows={3}
          />
        </div>

        {/* Order Total */}
        <div className="bg-accent/10 rounded-lg p-4 mt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Order Total:</span>
            <span className="text-2xl font-bold text-accent">
              {formatPrice(getTotalPrice())}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onCancel}
          >
            Back to Cart
          </Button>
          <Button
            type="submit"
            variant="default"
            size="lg"
            className="flex-1"
          >
            Continue to WhatsApp
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
