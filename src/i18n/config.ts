import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Get saved language preference or default to English
const savedLanguage = typeof window !== 'undefined'
  ? localStorage.getItem('dandle-language') || 'en'
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          // Navigation
          nav: {
            home: 'Home',
            collection: 'Collection',
            products: 'Products',
            completeSet: 'Complete Set',
            arView: 'AR View',
            about: 'About',
            contact: 'Contact',
            nourAI: 'Nour AI',
            shopNow: 'Shop Now',
            services: 'Services',
            showrooms: 'Showrooms',
            cart: 'Cart',
          },

          // Brand (Transliterated - Keep as is in Arabic)
          brand: {
            name: 'Dandle Recliners',
            nameAr: 'داندل ريكلاينرز', // Transliterated
            tagline: 'Earned Luxury',
            slogan: 'The Seat You Keep Coming Back To',
          },

          // Product Names (Transliterated - NOT Translated)
          products: {
            relaxmax: {
              name: 'RelaxMax',
              nameAr: 'ريلاكس ماكس',
              tagline: 'The Wellness Sanctuary',
            },
            comfortplus: {
              name: 'ComfortPlus',
              nameAr: 'كومفورت بلس',
              tagline: 'The Therapeutic Upgrade',
            },
            diva: {
              name: 'Diva',
              nameAr: 'ديفا',
              tagline: 'The Statement of Style',
            },
            cozycompanion: {
              name: 'CozyCompanion',
              nameAr: 'كوزي كومبانيون',
              tagline: 'The Anchor of Connection',
            },
            easyupStandard: {
              name: 'EasyUp Standard',
              nameAr: 'إيزي أب ستاندرد',
              tagline: 'The Empowerment Tool',
            },
            easyupCompact: {
              name: 'EasyUp Compact',
              nameAr: 'إيزي أب كومباكت',
              tagline: 'The Compact Empowerment Tool',
            },
            worknest: {
              name: 'WorkNest',
              nameAr: 'وورك نيست',
              tagline: 'The Productivity Haven',
            },
            spacesaver: {
              name: 'SpaceSaver',
              nameAr: 'سبيس سيفر',
              tagline: 'The Smart Solution',
            },
            heritageSet: {
              name: 'Heritage Set',
              nameAr: 'هيريتدج سيت',
              tagline: 'The Complete Collection',
            },
          },

          // Partner Names (Transliterated)
          partners: {
            omash: {
              name: 'OMASH',
              nameAr: 'أوماش',
            },
            istikbal: {
              name: 'Istikbal',
              nameAr: 'إستيكبال',
            },
            vivian: {
              name: 'Vivian',
              nameAr: 'فيفيان',
            },
          },

          // Fabric Color Names (Transliterated - NOT Translated)
          colors: {
            nileSapphireBlue: {
              name: 'Nile Sapphire Blue',
              nameAr: 'نايل سافاير بلو',
              fabric: 'Velvet',
            },
            alexandriaLinen: {
              name: 'Alexandria Linen',
              nameAr: 'ألكساندريا لينين',
              fabric: 'Belgian Linen',
            },
            desertSage: {
              name: 'Desert Sage',
              nameAr: 'ديزرت سيج',
              fabric: 'Microsuede',
            },
            desertGrey: {
              name: 'Desert Grey',
              nameAr: 'ديزرت جراي',
              fabric: 'Leather',
            },
            amberSand: {
              name: 'Amber Sand',
              nameAr: 'أمبر ساند',
              fabric: 'Nubuck Leather',
            },
            mochaTaupe: {
              name: 'Mocha Taupe',
              nameAr: 'موكا توب',
              fabric: 'Chenille',
            },
            coastalFogGrey: {
              name: 'Coastal Fog Grey',
              nameAr: 'كوستال فوج جراي',
              fabric: 'Chenille',
            },
            nileMistTerracotta: {
              name: 'Nile Mist Terracotta',
              nameAr: 'نايل ميست تيراكوتا',
              fabric: 'Cotton Velvet',
            },
            gizaGoldWeave: {
              name: 'Giza Gold Weave',
              nameAr: 'جيزا جولد ويف',
              fabric: 'Woven Fabric',
            },
            oasisGreen: {
              name: 'Oasis Green',
              nameAr: 'أواسيس جرين',
              fabric: 'Performance Fabric',
            },
            blueNileDenim: {
              name: 'Blue Nile Denim',
              nameAr: 'بلو نايل دينيم',
              fabric: 'Recycled Denim',
            },
            sandstormOchre: {
              name: 'Sandstorm Ochre',
              nameAr: 'ساندستورم أوكر',
              fabric: 'Cotton Blend',
            },
            papyrusStripe: {
              name: 'Papyrus Stripe',
              nameAr: 'بابيروس سترايب',
              fabric: 'Linen Blend',
            },
            clayPottery: {
              name: 'Clay Pottery',
              nameAr: 'كلاي بوتري',
              fabric: 'Textured Woven',
            },
          },

          // UI Labels
          ui: {
            addToCart: 'Add to Cart',
            shopNow: 'Shop Now',
            bookShowroom: 'Book Showroom Visit',
            requestConsultation: 'Request Consultation',
            orderViaWhatsapp: 'Order via WhatsApp',
            viewDetails: 'View Details',
            customizeNow: 'Customize Now',
            selectColor: 'Select Color',
            selectFabric: 'Select Fabric',
            selectMechanism: 'Select Mechanism',
            manual: 'Manual',
            power: 'Power',
            quantity: 'Quantity',
            total: 'Total',
            checkout: 'Checkout',
            continueShopping: 'Continue Shopping',
            viewInRoom: 'See It In My Room',
            downloadVisualization: 'Download Visualization',
            shareDesign: 'Share My Design',
            saveToFavorites: 'Save to Favorites',
            loading: 'Loading...',
            close: 'Close',
            next: 'Next',
            previous: 'Previous',
            of: 'of',
          },

          // Product Details
          productDetails: {
            specifications: 'Specifications',
            dimensions: 'Dimensions',
            weightCapacity: 'Weight Capacity',
            recliningAngles: 'Reclining Angles',
            frameMaterial: 'Frame Material',
            cushionFill: 'Cushion Fill',
            mechanism: 'Mechanism',
            assemblyRequired: 'Assembly Required',
            weight: 'Weight',
            warranty: 'Warranty',
            careInstructions: 'Care Instructions',
            countryOfOrigin: 'Country of Origin',
            madeInEgypt: 'Crafted in Cairo, Egypt',
            features: 'Features',
            deliveryInfo: 'Delivery Information',
            estimatedDelivery: 'Estimated Delivery',
            customOrderDelivery: '4-6 weeks for custom orders',
            inStockDelivery: 'In stock: 7-10 days',
            freeDelivery: 'Free delivery across Greater Cairo',
            nationwideShipping: 'Shipping available nationwide',
            whiteGloveService: 'White Glove Service',
            whiteGloveDescription: 'Professional delivery, assembly, packaging removal, and placement',
            priceVariesByFabric: 'Price varies by fabric selection',
            installmentOptions: 'Installment options available',
            fromPerMonth: 'From EGP {{amount}}/month',
          },

          // Reviews
          reviews: {
            customerReviews: 'Customer Reviews',
            writeReview: 'Write a Review',
            verifiedPurchase: 'Verified Purchase',
            mostRecent: 'Most Recent',
            highestRated: 'Highest Rated',
          },

          // Trust Signals
          trust: {
            comfortGuarantee: '30-Day Comfort Guarantee',
            madeInEgypt: 'Made in Egypt',
            freeConsultation: 'Free Consultation',
            securePayment: 'Secure Payment',
            warrantyBadge: '5-Year Frame Warranty',
          },

          // Sections
          sections: {
            featuredProducts: 'Featured Products',
            ourCollection: 'Our Collection',
            whyChooseUs: 'Why Choose Dandle',
            testimonials: 'What Our Customers Say',
            ourPartners: 'Our Partners',
            visitShowroom: 'Visit Our Showroom',
            contactUs: 'Contact Us',
            coreCollection: 'Core Collection',
            cairoTrends: 'Cairo Trends',
            youMayAlsoLike: 'You May Also Like',
            completeTheLook: 'Complete the Look',
            customersAlsoBought: 'Customers Also Bought',
          },

          // Color Disclaimer
          colorDisclaimer: 'Color representation may vary. Visit showroom for exact match.',

          // Footer
          footer: {
            aboutUs: 'About Us',
            ourStory: 'Our Story',
            careers: 'Careers',
            press: 'Press',
            customerService: 'Customer Service',
            shippingReturns: 'Shipping & Returns',
            faq: 'FAQ',
            contactUs: 'Contact Us',
            warranty: 'Warranty',
            followUs: 'Follow Us',
            newsletter: 'Newsletter',
            subscribeText: 'Subscribe for exclusive offers and updates',
            emailPlaceholder: 'Enter your email',
            subscribe: 'Subscribe',
            allRightsReserved: 'All Rights Reserved',
            privacyPolicy: 'Privacy Policy',
            termsOfService: 'Terms of Service',
          },

          // Nour AI Chat
          greeting: "Hi! I'm Nour, your smart designer. Show me your pic and I'll place the chair.",
          visualizeButton: 'Show Me',
          uploadPlaceholder: 'Drop your room photo or tap to upload',
          selectRecliner: 'Choose your recliner',
          visualize: 'Visualize in Your Room',
          makeChanges: 'Make Changes',
          chatWithNour: 'Chat with Nour',
          newVisualization: 'New Visualization',
          startOver: 'Start Over',
          rendering: 'Creating your vision...',
          complete: 'Visualization complete!',
          editsRemaining: '{{count}} edits remaining',
          originalRoom: 'Original Room',
          withRecliner: 'With {{model}} in {{color}}',
          beforeAfter: 'Swipe to compare',

          // Exit Intent Popup
          exitIntent: {
            headline: "Wait! Don't Miss Out",
            offer: 'Get 10% off your first order + free showroom consultation',
            namePlaceholder: 'Your Name',
            emailPlaceholder: 'Your Email',
            phonePlaceholder: 'Your Phone Number',
            productInterest: 'Product Interest (Optional)',
            claimDiscount: 'Claim My Discount',
          },

          // WhatsApp
          whatsapp: {
            chatWithUs: 'Chat with us on WhatsApp',
            onlineNow: 'Online Now',
            replyingSoon: "We'll reply soon",
          },

          // AR Feature
          ar: {
            viewInYourRoom: 'View in Your Room',
            scanQRCode: 'Scan QR code with your phone',
            arNotSupported: 'AR not supported on this device',
            tryVirtualConsultation: 'Book Virtual Consultation',
          },
        },
      },
      ar: {
        translation: {
          // Navigation (Translated)
          nav: {
            home: 'الرئيسية',
            collection: 'المجموعة',
            products: 'المنتجات',
            completeSet: 'طقم كامل',
            arView: 'عرض الواقع المعزز',
            about: 'عن داندل',
            contact: 'تواصل معنا',
            nourAI: 'نور AI',
            shopNow: 'تسوق الآن',
            services: 'الخدمات',
            showrooms: 'صالات العرض',
            cart: 'السلة',
          },

          // Brand (Transliterated)
          brand: {
            name: 'داندل ريكلاينرز',
            nameAr: 'داندل ريكلاينرز',
            tagline: 'رفاهية مُستحقة',
            slogan: 'المقعد الذي تعود إليه دائماً',
          },

          // Product Names (Transliterated - NOT Translated)
          products: {
            relaxmax: {
              name: 'ريلاكس ماكس',
              nameAr: 'ريلاكس ماكس',
              tagline: 'ملاذ العافية',
            },
            comfortplus: {
              name: 'كومفورت بلس',
              nameAr: 'كومفورت بلس',
              tagline: 'الترقية العلاجية',
            },
            diva: {
              name: 'ديفا',
              nameAr: 'ديفا',
              tagline: 'بيان الأناقة',
            },
            cozycompanion: {
              name: 'كوزي كومبانيون',
              nameAr: 'كوزي كومبانيون',
              tagline: 'مرساة التواصل',
            },
            easyupStandard: {
              name: 'إيزي أب ستاندرد',
              nameAr: 'إيزي أب ستاندرد',
              tagline: 'أداة التمكين',
            },
            easyupCompact: {
              name: 'إيزي أب كومباكت',
              nameAr: 'إيزي أب كومباكت',
              tagline: 'أداة التمكين المدمجة',
            },
            worknest: {
              name: 'وورك نيست',
              nameAr: 'وورك نيست',
              tagline: 'ملاذ الإنتاجية',
            },
            spacesaver: {
              name: 'سبيس سيفر',
              nameAr: 'سبيس سيفر',
              tagline: 'الحل الذكي',
            },
            heritageSet: {
              name: 'هيريتدج سيت',
              nameAr: 'هيريتدج سيت',
              tagline: 'المجموعة الكاملة',
            },
          },

          // Partner Names (Transliterated)
          partners: {
            omash: {
              name: 'أوماش',
              nameAr: 'أوماش',
            },
            istikbal: {
              name: 'إستيكبال',
              nameAr: 'إستيكبال',
            },
            vivian: {
              name: 'فيفيان',
              nameAr: 'فيفيان',
            },
          },

          // Fabric Color Names (Transliterated - NOT Translated)
          colors: {
            nileSapphireBlue: {
              name: 'نايل سافاير بلو',
              nameAr: 'نايل سافاير بلو',
              fabric: 'مخمل',
            },
            alexandriaLinen: {
              name: 'ألكساندريا لينين',
              nameAr: 'ألكساندريا لينين',
              fabric: 'كتان بلجيكي',
            },
            desertSage: {
              name: 'ديزرت سيج',
              nameAr: 'ديزرت سيج',
              fabric: 'ميكروسويد',
            },
            desertGrey: {
              name: 'ديزرت جراي',
              nameAr: 'ديزرت جراي',
              fabric: 'جلد',
            },
            amberSand: {
              name: 'أمبر ساند',
              nameAr: 'أمبر ساند',
              fabric: 'جلد نوبك',
            },
            mochaTaupe: {
              name: 'موكا توب',
              nameAr: 'موكا توب',
              fabric: 'شينيل',
            },
            coastalFogGrey: {
              name: 'كوستال فوج جراي',
              nameAr: 'كوستال فوج جراي',
              fabric: 'شينيل',
            },
            nileMistTerracotta: {
              name: 'نايل ميست تيراكوتا',
              nameAr: 'نايل ميست تيراكوتا',
              fabric: 'مخمل قطني',
            },
            gizaGoldWeave: {
              name: 'جيزا جولد ويف',
              nameAr: 'جيزا جولد ويف',
              fabric: 'قماش منسوج',
            },
            oasisGreen: {
              name: 'أواسيس جرين',
              nameAr: 'أواسيس جرين',
              fabric: 'قماش عالي الأداء',
            },
            blueNileDenim: {
              name: 'بلو نايل دينيم',
              nameAr: 'بلو نايل دينيم',
              fabric: 'دنيم معاد تدويره',
            },
            sandstormOchre: {
              name: 'ساندستورم أوكر',
              nameAr: 'ساندستورم أوكر',
              fabric: 'مزيج قطني',
            },
            papyrusStripe: {
              name: 'بابيروس سترايب',
              nameAr: 'بابيروس سترايب',
              fabric: 'مزيج كتاني',
            },
            clayPottery: {
              name: 'كلاي بوتري',
              nameAr: 'كلاي بوتري',
              fabric: 'منسوج محبب',
            },
          },

          // UI Labels (Translated)
          ui: {
            addToCart: 'أضف للسلة',
            shopNow: 'تسوق الآن',
            bookShowroom: 'احجز زيارة المعرض',
            requestConsultation: 'اطلب استشارة',
            orderViaWhatsapp: 'اطلب عبر واتساب',
            viewDetails: 'عرض التفاصيل',
            customizeNow: 'خصص الآن',
            selectColor: 'اختر اللون',
            selectFabric: 'اختر القماش',
            selectMechanism: 'اختر آلية التحريك',
            manual: 'يدوي',
            power: 'كهربائي',
            quantity: 'الكمية',
            total: 'المجموع',
            checkout: 'إتمام الشراء',
            continueShopping: 'متابعة التسوق',
            viewInRoom: 'شاهده في غرفتك',
            downloadVisualization: 'تحميل التصميم',
            shareDesign: 'شارك تصميمي',
            saveToFavorites: 'حفظ في المفضلة',
            loading: 'جاري التحميل...',
            close: 'إغلاق',
            next: 'التالي',
            previous: 'السابق',
            of: 'من',
          },

          // Product Details (Translated)
          productDetails: {
            specifications: 'المواصفات',
            dimensions: 'الأبعاد',
            weightCapacity: 'سعة الوزن',
            recliningAngles: 'زوايا الإمالة',
            frameMaterial: 'مادة الهيكل',
            cushionFill: 'حشوة الوسادة',
            mechanism: 'الآلية',
            assemblyRequired: 'يتطلب تجميع',
            weight: 'الوزن',
            warranty: 'الضمان',
            careInstructions: 'تعليمات العناية',
            countryOfOrigin: 'بلد المنشأ',
            madeInEgypt: 'صُنع في القاهرة، مصر',
            features: 'المميزات',
            deliveryInfo: 'معلومات التوصيل',
            estimatedDelivery: 'موعد التوصيل المتوقع',
            customOrderDelivery: '٤-٦ أسابيع للطلبات المخصصة',
            inStockDelivery: 'متوفر: ٧-١٠ أيام',
            freeDelivery: 'توصيل مجاني داخل القاهرة الكبرى',
            nationwideShipping: 'الشحن متاح على مستوى الجمهورية',
            whiteGloveService: 'خدمة التوصيل الكاملة',
            whiteGloveDescription: 'توصيل احترافي، تركيب، إزالة التغليف، والتثبيت',
            priceVariesByFabric: 'السعر يختلف حسب اختيار القماش',
            installmentOptions: 'خيارات التقسيط متاحة',
            fromPerMonth: 'من {{amount}} جنيه/شهرياً',
          },

          // Reviews (Translated)
          reviews: {
            customerReviews: 'آراء العملاء',
            writeReview: 'اكتب تقييماً',
            verifiedPurchase: 'عملية شراء موثقة',
            mostRecent: 'الأحدث',
            highestRated: 'الأعلى تقييماً',
          },

          // Trust Signals (Translated)
          trust: {
            comfortGuarantee: 'ضمان الراحة ٣٠ يوماً',
            madeInEgypt: 'صُنع في مصر',
            freeConsultation: 'استشارة مجانية',
            securePayment: 'دفع آمن',
            warrantyBadge: 'ضمان ٥ سنوات على الهيكل',
          },

          // Sections (Translated)
          sections: {
            featuredProducts: 'منتجات مميزة',
            ourCollection: 'مجموعتنا',
            whyChooseUs: 'لماذا داندل',
            testimonials: 'ماذا يقول عملاؤنا',
            ourPartners: 'شركاؤنا',
            visitShowroom: 'زر صالة العرض',
            contactUs: 'تواصل معنا',
            coreCollection: 'المجموعة الأساسية',
            cairoTrends: 'صيحات القاهرة',
            youMayAlsoLike: 'قد يعجبك أيضاً',
            completeTheLook: 'أكمل المظهر',
            customersAlsoBought: 'عملاء آخرون اشتروا',
          },

          // Color Disclaimer
          colorDisclaimer: 'قد يختلف تمثيل الألوان. قم بزيارة المعرض للمطابقة الدقيقة.',

          // Footer (Translated)
          footer: {
            aboutUs: 'عن داندل',
            ourStory: 'قصتنا',
            careers: 'وظائف',
            press: 'الصحافة',
            customerService: 'خدمة العملاء',
            shippingReturns: 'الشحن والإرجاع',
            faq: 'الأسئلة الشائعة',
            contactUs: 'تواصل معنا',
            warranty: 'الضمان',
            followUs: 'تابعنا',
            newsletter: 'النشرة الإخبارية',
            subscribeText: 'اشترك للحصول على عروض حصرية وآخر الأخبار',
            emailPlaceholder: 'أدخل بريدك الإلكتروني',
            subscribe: 'اشترك',
            allRightsReserved: 'جميع الحقوق محفوظة',
            privacyPolicy: 'سياسة الخصوصية',
            termsOfService: 'شروط الخدمة',
          },

          // Nour AI Chat (Translated)
          greeting: 'أهلاً! أنا نور، مصممتك الذكية. ورّيني صورتك وأنا هورّيك الكرسي في مكانه.',
          visualizeButton: 'ورّيني',
          uploadPlaceholder: 'اسحب صورة الغرفة أو اضغط للرفع',
          selectRecliner: 'اختر الكرسي',
          visualize: 'شوف الكرسي في مكانه',
          makeChanges: 'غيّر التصميم',
          chatWithNour: 'كلّم نور',
          newVisualization: 'تصميم جديد',
          startOver: 'ابدأ من جديد',
          rendering: 'بنجهز رؤيتك...',
          complete: 'التصميم جاهز!',
          editsRemaining: 'باقي {{count}} تعديلات',
          originalRoom: 'الغرفة الأصلية',
          withRecliner: 'مع {{model}} {{color}}',
          beforeAfter: 'اسحب للمقارنة',

          // Exit Intent Popup (Translated)
          exitIntent: {
            headline: 'انتظر! لا تفوت الفرصة',
            offer: 'احصل على خصم ١٠٪ على أول طلب + استشارة مجانية في المعرض',
            namePlaceholder: 'اسمك',
            emailPlaceholder: 'بريدك الإلكتروني',
            phonePlaceholder: 'رقم هاتفك',
            productInterest: 'المنتج المهتم به (اختياري)',
            claimDiscount: 'احصل على الخصم',
          },

          // WhatsApp (Translated)
          whatsapp: {
            chatWithUs: 'تواصل معنا عبر واتساب',
            onlineNow: 'متصل الآن',
            replyingSoon: 'سنرد قريباً',
          },

          // AR Feature (Translated)
          ar: {
            viewInYourRoom: 'شاهده في غرفتك',
            scanQRCode: 'امسح رمز QR بهاتفك',
            arNotSupported: 'الواقع المعزز غير مدعوم على هذا الجهاز',
            tryVirtualConsultation: 'احجز استشارة افتراضية',
          },
        },
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

// Helper to toggle language
export const toggleLanguage = () => {
  const newLang = i18n.language === 'en' ? 'ar' : 'en';
  i18n.changeLanguage(newLang);
  localStorage.setItem('dandle-language', newLang);

  // Update document direction for RTL support
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = newLang;

  return newLang;
};

// Helper to get current language
export const getCurrentLanguage = () => i18n.language;

// Helper to check if current language is RTL
export const isRTL = () => i18n.language === 'ar';
