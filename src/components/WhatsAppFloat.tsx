import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    window.open(
      "https://wa.me/201222804255?text=Hello! I'd like to learn more about Dandle recliners.",
      "_blank"
    );
  };

  if (!isVisible) return null;

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300"
      style={{
        backgroundColor: '#25D366', // WhatsApp green
      }}
      onClick={handleWhatsAppClick}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat with Dandle on WhatsApp"
    >
      {/* Pulse ring animation */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: '#25D366' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 0, 0.7],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <MessageCircle size={24} className="text-white relative z-10" />

      <motion.span
        className="text-white font-medium text-sm whitespace-nowrap relative z-10"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        {isExpanded && "Chat with Dandle"}
      </motion.span>
    </motion.button>
  );
};

export default WhatsAppFloat;
