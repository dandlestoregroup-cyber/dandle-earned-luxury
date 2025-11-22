import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Navigation
          nav: {
            home: "Home",
            collection: "Collection",
            completeSet: "Complete Set",
            arView: "AR View",
            about: "About",
            contact: "Contact",
            nourAI: "Nour AI",
            shopNow: "Shop Now",
            cart: "Cart"
          },
          // Hero
          hero: {
            title: "Crafted Comfort",
            subtitle: "Egyptian luxury recliners designed for the discerning professional",
            cta: "Explore Collection"
          },
          // Product
          product: {
            addToCart: "Add to Cart",
            customize: "Customize Now",
            viewDetails: "View Details",
            price: "Price",
            colors: "Colors",
            mechanism: "Mechanism Type",
            manual: "Manual",
            power: "Power",
            baseType: "Base Type",
            fixed: "Fixed Base",
            swivel: "Swivel Base",
            swivel360: "Swivel + 360° Rotation",
            lastTouch: "The Last Touch",
            specialAdditions: "Special Additions",
            premiumTherapy: "Premium Therapy",
            massageFeature: "Massage Feature",
            giftWrap: "Premium Gift Wrapping",
            engraving: "Legacy Plaque",
            cupHolders: "Cup Holders",
            usbPorts: "USB Charging Ports",
            sidePocket: "Side Pocket",
            specialNotes: "Special Notes",
            total: "Total",
            commission: "Service Charge",
            instalments: "Pay in Instalments",
            perMonth: "per month"
          },
          // Footer
          footer: {
            tagline: "Elevating Egyptian comfort",
            copyright: "© 2025 DANDLE. All rights reserved."
          },
          // Nour AI
          greeting: "Hi! I'm Nour, your smart designer. Show me your pic and I'll place the chair.",
          visualizeButton: "Show Me",
          uploadPlaceholder: "Drop your room photo or tap to upload",
          selectRecliner: "Choose your recliner",
          visualize: "Visualize in Your Room",
          makeChanges: "Make Changes",
          chatWithNour: "Chat with Nour",
          newVisualization: "New Visualization",
          startOver: "Start Over",
          rendering: "Creating your vision...",
          complete: "Visualization complete!",
          editsRemaining: "{{count}} edits remaining",
          originalRoom: "Original Room",
          withRecliner: "With {{model}} in {{color}}",
          beforeAfter: "Swipe to compare"
        }
      },
      ar: {
        translation: {
          // Navigation
          nav: {
            home: "الرئيسية",
            collection: "المجموعة",
            completeSet: "الطقم الكامل",
            arView: "العرض التفاعلي",
            about: "عن داندل",
            contact: "تواصل معنا",
            nourAI: "نور الذكية",
            shopNow: "تسوّق الآن",
            cart: "السلة"
          },
          // Hero
          hero: {
            title: "راحة مصنوعة بحرفية",
            subtitle: "كراسي استرخاء فاخرة للمحترفين المميزين في مصر",
            cta: "استكشف المجموعة"
          },
          // Product
          product: {
            addToCart: "أضف للسلة",
            customize: "خصّص الآن",
            viewDetails: "عرض التفاصيل",
            price: "السعر",
            colors: "الألوان",
            mechanism: "نوع الميكانيزم",
            manual: "يدوي",
            power: "كهربائي",
            baseType: "نوع القاعدة",
            fixed: "قاعدة ثابتة",
            swivel: "قاعدة دوارة",
            swivel360: "دوران ٣٦٠ درجة",
            lastTouch: "اللمسة الأخيرة",
            specialAdditions: "إضافات خاصة",
            premiumTherapy: "علاج فاخر",
            massageFeature: "ميزة التدليك",
            giftWrap: "تغليف هدايا فاخر",
            engraving: "لوحة تذكارية",
            cupHolders: "حاملات أكواب",
            usbPorts: "منافذ شحن USB",
            sidePocket: "جيب جانبي",
            specialNotes: "ملاحظات خاصة",
            total: "الإجمالي",
            commission: "رسوم الخدمة",
            instalments: "قسّط على",
            perMonth: "شهرياً"
          },
          // Footer
          footer: {
            tagline: "نرتقي بالراحة المصرية",
            copyright: "© ٢٠٢٥ داندل. جميع الحقوق محفوظة."
          },
          // Nour AI
          greeting: "أهلاً! أنا نور، مصممتك الذكية. ورّيني صورتك وأنا هورّيك الكرسي في مكانه.",
          visualizeButton: "ورّيني",
          uploadPlaceholder: "اسحب صورة الغرفة أو اضغط للرفع",
          selectRecliner: "اختر الكرسي",
          visualize: "شوف الكرسي في مكانه",
          makeChanges: "غيّر التصميم",
          chatWithNour: "كلّم نور",
          newVisualization: "تصميم جديد",
          startOver: "ابدأ من جديد",
          rendering: "بنجهز رؤيتك...",
          complete: "التصميم جاهز!",
          editsRemaining: "باقي {{count}} تعديلات",
          originalRoom: "الغرفة الأصلية",
          withRecliner: "مع {{model}} {{color}}",
          beforeAfter: "اسحب للمقارنة"
        }
      }
    },
    lng: 'en', // Default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
