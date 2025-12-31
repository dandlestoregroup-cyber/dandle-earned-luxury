/* Prompt 2E: Complete i18n strings */

export type LangKey = 'en' | 'ar';

export const STRINGS = {
  en: {
    hero: {
      title: 'The Art of Rest',
      subtitle: 'Premium Egyptian recliners crafted for real homes — calm comfort that lasts.',
      cta: 'Explore Collection',
      placeOrder: 'Place Your Order',
      offerDetails: 'Free Delivery on all orders • 5-Year Warranty',
      promoLine: 'Festive offer: Up to 10% off — Code: FESTIVE10',
    },
    nav: {
      products: 'Products',
      fabrics: 'Fabrics',
      partnership: 'Partnership',
      contact: 'Contact',
      story: 'Our Story',
      careers: 'Careers',
    },
    cta: {
      whatsapp: 'Order on WhatsApp',
      call: 'Call Us',
      sendRoom: 'Send Room → Ready in 72hrs',
    },
    products: {
      relaxmax: { name: 'RelaxMax', desc: 'Our flagship zero-gravity recliner' },
      comfortplus: { name: 'ComfortPlus', desc: 'Enhanced comfort with premium support' },
      diva: { name: 'Diva', desc: 'Elegant design meets superior comfort' },
      cozycompanion: { name: 'CozyCompanion', desc: 'Perfect for couples and families' },
      easyup: { name: 'EasyUp', desc: 'Lift assistance for easy rising' },
      'easyup-compact': { name: 'EasyUp Compact', desc: 'Space-saving lift recliner' },
      worknest: { name: 'WorkNest', desc: 'Designed for work-from-home comfort' },
      spacesaver: { name: 'SpaceSaver', desc: 'Full features in a compact frame' },
      'complete-set': { name: 'Heritage Set', desc: 'Complete living room collection' },
    },
    partnership: {
      heading: 'Visit the DANDLE Section at Istikbal',
      body: 'Experience our full collection at the dedicated DANDLE section inside Istikbal — Egypt\'s most trusted furniture destination.',
    },
    fabrics: {
      title: 'Premium Fabrics',
      intro: 'Curated materials for lasting comfort and style.',
      paragraph_ar_verbatim: '',
    },
    footer: {
      rights: '© All rights reserved.',
    },
    gallery: {
      openNewTab: 'Open in new tab',
      close: 'Close',
    },
  },
  ar: {
    hero: {
      title: 'فن الراحة',
      subtitle: 'كراسي استرخاء مصرية فاخرة لبيوت حقيقية — راحة هادئة تعيش معك.',
      cta: 'استكشف المجموعة',
      placeOrder: 'قدّم طلبك',
      offerDetails: 'توصيل مجاني على كل الطلبات • ضمان 5 سنوات',
      promoLine: 'عرض موسمي: خصم حتى 10% — الكود: FESTIVE10',
    },
    nav: {
      products: 'المنتجات',
      fabrics: 'الخامات',
      partnership: 'الشراكة',
      contact: 'تواصل',
      story: 'قصتنا',
      careers: 'الوظائف',
    },
    cta: {
      whatsapp: 'اطلب عبر واتساب',
      call: 'اتصل بنا',
      sendRoom: 'ارسل غرفتي → جاهز خلال 72 ساعة',
    },
    products: {
      relaxmax: { name: 'ريلاكس ماكس', desc: 'كرسي الاسترخاء الرائد بتقنية انعدام الجاذبية' },
      comfortplus: { name: 'كمفورت بلس', desc: 'راحة معززة بدعم فائق' },
      diva: { name: 'ديفا', desc: 'تصميم أنيق يلتقي براحة لا مثيل لها' },
      cozycompanion: { name: 'كوزي كومبانيون', desc: 'مثالي للأزواج والعائلات' },
      easyup: { name: 'إيزي أب', desc: 'مساعدة رفع للنهوض بسهولة' },
      'easyup-compact': { name: 'إيزي أب كومباكت', desc: 'كرسي رفع موفر للمساحة' },
      worknest: { name: 'وورك نست', desc: 'مصمم لراحة العمل من المنزل' },
      spacesaver: { name: 'سبيس سيفر', desc: 'مميزات كاملة في إطار مدمج' },
      'complete-set': { name: 'طقم التراث', desc: 'مجموعة غرفة المعيشة الكاملة' },
    },
    partnership: {
      heading: 'زر قسم داندل في إستيكبال',
      body: 'جرب مجموعتنا الكاملة في قسم داندل المخصص داخل إستيكبال — أكثر وجهات الأثاث ثقة في مصر.',
    },
    fabrics: {
      title: 'الخامات',
      intro: 'خامات مختارة بعناية للراحة والأناقة الدائمة.',
      paragraph_ar_verbatim: `إحنا في Dandle بنركّز جدًا على الخامات من حيث اللون، الإحساس، وثبات الجودة، وشايفين إن في توافق واضح مع طريقة شغل Raytex.

نتطلع إننا نبدأ خطوة بخطوة، ونشوف إزاي نقدر نبني تعاون قوي ومفيد للطرفين. متحمسين للخطوة الجاية معاكم..`,
    },
    footer: {
      rights: '© جميع الحقوق محفوظة.',
    },
    gallery: {
      openNewTab: 'فتح في تبويب جديد',
      close: 'إغلاق',
    },
  },
} as const;

function getByPath(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), obj);
}

export function t(path: string, lang: LangKey = 'ar'): string {
  const v = getByPath(STRINGS[lang], path);
  if (typeof v === 'string') return v;
  const fallback = getByPath(STRINGS.en, path);
  return typeof fallback === 'string' ? fallback : path;
}

export function getLangFromStorage(): LangKey {
  if (typeof window === 'undefined') return 'ar';
  const v = localStorage.getItem('dandle_lang') || localStorage.getItem('lang');
  return v === 'en' ? 'en' : 'ar';
}
