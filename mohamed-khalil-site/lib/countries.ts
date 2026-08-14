// ================================================================
// بيانات كل دولة على حدة: العملة، رقم الواتساب، والدورات (المراحل
// الدراسية تختلف من دولة لأخرى). لإضافة دولة جديدة: أضف مفتاحًا جديدًا
// بنفس الشكل بالضبط لكائن `countries` بالأسفل.
// ================================================================

export type CountryCourse = {
  id: string;
  title: string;
  stage: string;
  subject: "فيزياء" | "رياضيات";
  price: number;
  oldPrice?: number;
  description: string;
  features: string[];
  badge?: string;
};

export type Country = {
  code: string; // يُستخدم بالرابط: /sa /jo /om /ae
  name: string; // اسم الدولة بالعربي
  flag: string; // علم كإيموجي
  currency: string; // رمز العملة المختصر يظهر بجانب السعر
  whatsapp: string; // رابط واتساب مباشر بمفتاح الدولة
  heroLine: string; // سطر صغير أعلى العنوان الرئيسي يذكر الدولة
  courses: CountryCourse[];
};

export const countries: Record<string, Country> = {
  sa: {
    code: "sa",
    name: "السعودية",
    flag: "🇸🇦",
    currency: "ر.س",
    whatsapp: "https://wa.me/966500000000",
    heroLine: "فيزياء • رياضيات — الثانوية العامة السعودية",
    courses: [
      {
        id: "sa-physics-1",
        title: "فيزياء أول ثانوي - كورس شامل",
        stage: "أول ثانوي",
        subject: "فيزياء",
        price: 149,
        oldPrice: 199,
        description: "شرح كامل لمنهج الفيزياء للصف الأول الثانوي مع حل تمارين الكتاب واختبارات دورية.",
        features: ["+40 ساعة شرح", "بنك أسئلة ضخم", "متابعة أسبوعية"],
        badge: "الأكثر طلبًا",
      },
      {
        id: "sa-physics-2",
        title: "فيزياء ثاني ثانوي - ميكانيكا وكهرباء",
        stage: "ثاني ثانوي",
        subject: "فيزياء",
        price: 179,
        description: "تأسيس قوي في الميكانيكا والكهرباء الساكنة مع حل مسائل مركبة.",
        features: ["+45 ساعة شرح", "حصص حل مسائل", "جروب دعم"],
      },
      {
        id: "sa-physics-3",
        title: "فيزياء ثالث ثانوي - نظام المسارات",
        stage: "ثالث ثانوي",
        subject: "فيزياء",
        price: 229,
        oldPrice: 279,
        description: "مراجعة شاملة تناسب اختبارات القدرات والتحصيلي.",
        features: ["+60 ساعة شرح", "نماذج اختبارات", "استشارة فردية"],
        badge: "عرض خاص",
      },
      {
        id: "sa-math-all",
        title: "رياضيات جميع المراحل - باقة شاملة",
        stage: "جميع المراحل",
        subject: "رياضيات",
        price: 199,
        description: "تغطية كاملة لمنهج الرياضيات لكل المراحل الثانوية.",
        features: ["تحديث مستمر للمحتوى", "حل واجبات دورية", "دعم فني مباشر"],
      },
    ],
  },

  ae: {
    code: "ae",
    name: "الإمارات",
    flag: "🇦🇪",
    currency: "د.إ",
    whatsapp: "https://wa.me/971500000000",
    heroLine: "فيزياء • رياضيات — المنهاج الإماراتي",
    courses: [
      {
        id: "ae-physics-11",
        title: "فيزياء الصف الحادي عشر",
        stage: "الصف الحادي عشر",
        subject: "فيزياء",
        price: 150,
        description: "شرح منهج الحادي عشر (عام/متقدم) مع حل تمارين وتدريبات.",
        features: ["+40 ساعة شرح", "بنك أسئلة", "متابعة أسبوعية"],
      },
      {
        id: "ae-physics-12",
        title: "فيزياء الصف الثاني عشر - مراجعة شاملة",
        stage: "الصف الثاني عشر",
        subject: "فيزياء",
        price: 220,
        oldPrice: 260,
        description: "مراجعة مكثفة تناسب الامتحان الوزاري مع نماذج سابقة.",
        features: ["+55 ساعة شرح", "نماذج امتحانات سابقة", "استشارة فردية"],
        badge: "عرض خاص",
      },
      {
        id: "ae-math-all",
        title: "رياضيات جميع المراحل - باقة شاملة",
        stage: "جميع المراحل",
        subject: "رياضيات",
        price: 190,
        description: "تغطية كاملة لمنهج الرياضيات بالمنهاج الإماراتي.",
        features: ["تحديث مستمر للمحتوى", "حل واجبات دورية", "دعم فني مباشر"],
      },
    ],
  },
};

export const countryList = Object.values(countries);

export function getCountry(code: string): Country | undefined {
  return countries[code];
}
