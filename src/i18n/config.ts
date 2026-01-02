import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
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
          beforeAfter: "Swipe to compare",
          // Product-related translations
          ourCollection: "Our Collection",
          customizeNow: "Customize Now",
          notifyMe: "Notify Me",
          contactForPrice: "Contact for Price",
          back: "Back",
          loadingPrice: "Loading price...",
          currentlyUnavailable: "Currently unavailable",
          quantity: "Quantity",
          addToCart: "Add to Cart",
          contactUs: "Contact Us",
          aboutThisProduct: "About This Product",
          productDescription: "Handcrafted in Cairo, Egypt with premium materials and meticulous attention to detail.",
          priceOnRequest: "Price on request",
        }
      },
      ar: {
        translation: {
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
          beforeAfter: "اسحب للمقارنة",
          // Product-related translations
          ourCollection: "مجموعتنا",
          customizeNow: "خصّص الآن",
          notifyMe: "أعلمني",
          contactForPrice: "تواصل للسعر",
          back: "رجوع",
          loadingPrice: "جارٍ تحميل السعر...",
          currentlyUnavailable: "غير متوفر حالياً",
          quantity: "الكمية",
          addToCart: "أضف للسلة",
          contactUs: "تواصل معنا",
          aboutThisProduct: "عن هذا المنتج",
          productDescription: "صُنع بعناية في القاهرة، مصر باستخدام خامات فاخرة واهتمام دقيق بالتفاصيل.",
          priceOnRequest: "السعر عند الطلب",
        }
      }
    },
    lng: 'ar', // Default to Arabic
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
