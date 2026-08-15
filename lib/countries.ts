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
    whatsapp: "https://wa.me/962796009496",
    heroLine: "فيزياء • رياضيات — الثانوية العامة السعودية",
    courses: [
      {
        id: "sa-physics-1",
        title: "فيزياء ثانوي ",
        stage: "أول ثانوي",
        subject: "فيزياء",
        price: 75,
        oldPrice: 100,
        description: "شرح كامل لمنهج الفيزياء للصف الأول الثانوي - ثاني ثانوي -ثالث ثانوي مع حل تمارين الكتاب واختبارات دورية.",
        features: ["مدة الحصة ساعة  60 دقيقة ","حصص تفاعلية عبر Google meet " ,"حل أسئلة الدروس والواجبات ","يمكن الحجز فردي أو مجموعة "],
        badge: "الأكثر طلبًا",
      },
      {
        id: "sa-physics-2",
        title: "فيزياء ثانوي - تحصيلي ",
        stage: "ثالث ثانوي",
        subject: "فيزياء",
        price: 500,
        oldPrice: 600,
        description: "تأسيس قوي و تحضير للاختبار التحصيلي .",
        features: ["25 ساعة تأسيس","حصص تفاعلية عبر Google meet ", " حل مسائل و تجميعات", "مجموعات صغيرة (حد أقصى 5 طلاب )" ,"جروب دعم"],
      },
      {
        id: "sa-physics-2",
        title: "رياضيات ثانوي - تحصيلي ",
        stage: "ثالث ثانوي",
        subject: "فيزياء",
        price: 500,
        oldPrice: 600,
        description: "تأسيس قوي و تحضير للاختبار التحصيلي .",
        features: ["25 ساعة تأسيس","حصص تفاعلية عبر Google meet ", " حل مسائل و تجميعات", "مجموعات صغيرة (حد أقصى 5 طلاب )" ,"جروب دعم"],
      },
      {
        id: "sa-math-all",
        title: "رياضيات جميع المراحل - باقة شاملة",
        stage: "جميع المراحل",
        subject: "رياضيات",
        price: 75,
        oldPrice: 100,
        description: "شرح كامل لمنهج الرياضيات للصف الأول الثانوي - ثاني ثانوي -ثالث ثانوي مع حل تمارين الكتاب واختبارات دورية.",
        features: ["مدة الحصة ساعة  60 دقيقة ","حصص تفاعلية عبر Google meet " ,"حل أسئلة الدروس والواجبات ","يمكن الحجز فردي أو مجموعة "],
        badge: "الأكثر طلبًا",
      },
    ],
  },

  ae: {
    code: "ae",
    name: "الإمارات",
    flag: "🇦🇪",
    currency: "د.إ",
    whatsapp: "https://wa.me/962796009496",
    heroLine: "فيزياء • رياضيات — المنهاج الإماراتي",
    courses: [
      {
        id: "ae-physics-11",
        title: "فيزياء تاسع - عاشر - حادي عشر - ثاني عشر ",
        stage: "الصف الحادي عشر",
        subject: "فيزياء",
        price: 75,
        oldPrice: 100,
        description: "شرح منهج الحادي عشر (عام/متقدم) مع حل تمارين وتدريبات.",
        features: ["مدة الحصة ساعة  60 دقيقة ","حصص تفاعلية عبر Google meet " ,"حل أسئلة الدروس والواجبات ","يمكن الحجز فردي أو مجموعة "],
      },
     
      {
        id: "ae-math-all",
        title: "رياضيات جميع المراحل - باقة شاملة",
        stage: "جميع المراحل",
        subject: "رياضيات",
        price: 75,
        oldPrice: 100,
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
