import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/201222804255?text=Hello! I'd like to learn more about Dandle recliners.",
      "_blank"
    );
  };

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full shadow-luxury hover:shadow-glow"
      onClick={handleWhatsAppClick}
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={28} />
    </Button>
  );
};

export default WhatsAppFloat;
