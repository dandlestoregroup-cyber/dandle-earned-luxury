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
