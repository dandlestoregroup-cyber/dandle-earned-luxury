import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isRTL } from "@/i18n/config";
import { cn } from "@/lib/utils";

const WhatsAppFloat = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const { t } = useTranslation();
  const isArabic = isRTL();

  // Check if currently in business hours
  // Online: 10 AM - 3 PM and 7 PM - 9 PM Cairo time
  const checkOnlineStatus = () => {
    const now = new Date();
    // Cairo is UTC+2
    const cairoOffset = 2;
    const utcHours = now.getUTCHours();
    const cairoHours = (utcHours + cairoOffset) % 24;

    const isMorningShift = cairoHours >= 10 && cairoHours < 15; // 10 AM - 3 PM
    const isEveningShift = cairoHours >= 19 && cairoHours < 21; // 7 PM - 9 PM

    return isMorningShift || isEveningShift;
  };

  useEffect(() => {
    // Show after 3 seconds
    const timer = setTimeout(() => setIsVisible(true), 3000);

    // Check online status initially and every minute
    setIsOnline(checkOnlineStatus());
    const statusInterval = setInterval(() => {
      setIsOnline(checkOnlineStatus());
    }, 60000);

    return () => {
      clearTimeout(timer);
      clearInterval(statusInterval);
    };
  }, []);

  const handleWhatsAppClick = () => {
    // Different greeting based on language
    const message = isArabic
      ? "مرحباً! أريد الاستفسار عن منتجات داندل ريكلاينرز"
      : "Hello! I'd like to learn more about Dandle recliners.";

    window.open(
      `https://wa.me/201222804255?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (!isVisible) return null;

  return (
    <motion.button
      className={cn(
        "fixed bottom-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300",
        isArabic ? "left-6" : "right-6"
      )}
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
      aria-label={t('whatsapp.chatWithUs')}
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

      {/* Online status indicator */}
      <span
        className={cn(
          "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white z-20",
          isOnline ? "bg-green-400" : "bg-gray-400"
        )}
        title={isOnline ? t('whatsapp.onlineNow') : t('whatsapp.replyingSoon')}
      >
        {isOnline && (
          <motion.span
            className="absolute inset-0 rounded-full bg-green-400"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </span>

      <MessageCircle size={24} className="text-white relative z-10" />

      <motion.div
        className="relative z-10 overflow-hidden"
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        {isExpanded && (
          <div className="flex flex-col items-start whitespace-nowrap">
            <span className="text-white font-medium text-sm">
              {isArabic ? "تواصل مع داندل" : "Chat with Dandle"}
            </span>
            <span className="text-white/80 text-xs">
              {isOnline ? t('whatsapp.onlineNow') : t('whatsapp.replyingSoon')}
            </span>
          </div>
        )}
      </motion.div>
    </motion.button>
  );
};

export default WhatsAppFloat;
