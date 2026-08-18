// ================================================================
// جميع بيانات الموقع القابلة للتعديل في مكان واحد.
// لإضافة دورة أو فيديو أو رأي طالب جديد، أضف عنصرًا جديدًا للمصفوفة
// المناسبة بنفس الشكل (نفس الحقول). لا حاجة لتعديل أي مكون آخر.
// ================================================================

export type Course = {
  id: string;
  title: string;
  stage: string; // المرحلة الدراسية
  subject: "فيزياء" | "رياضيات";
  price: number;
  oldPrice?: number;
  description: string;
  features: string[];
  badge?: string;
};

export const courses: Course[] = [
  {
    id: "physics-1",
    title: "فيزياء أول ثانوي - كورس شامل",
    stage: "أول ثانوي",
    subject: "فيزياء",
    price: 149,
    oldPrice: 199,
    description:
      "شرح كامل لمنهج الفيزياء للصف الأول الثانوي مع حل تمارين الكتاب واختبارات دورية.",
    features: ["+40 ساعة شرح", "بنك أسئلة ضخم", "متابعة أسبوعية", "شهادة إتمام"],
    badge: "الأكثر طلبًا",
  },
  {
    id: "physics-2",
    title: "فيزياء ثاني ثانوي - ميكانيكا وكهرباء",
    stage: "ثاني ثانوي",
    subject: "فيزياء",
    price: 179,
    description:
      "تأسيس قوي في الميكانيكا والكهرباء الساكنة مع استراتيجيات حل المسائل المركبة.",
    features: ["+45 ساعة شرح", "حصص حل مسائل", "ملازم PDF", "جروب دعم"],
  },
  {
    id: "physics-3",
    title: "فيزياء ثالث ثانوي - نظام المسارات",
    stage: "ثالث ثانوي",
    subject: "فيزياء",
    price: 229,
    oldPrice: 279,
    description:
      "مراجعة شاملة ومكثفة تناسب اختبارات القدرات والتحصيلي مع نماذج اختبارات محاكية.",
    features: ["+60 ساعة شرح", "نماذج اختبارات", "مراجعة نهائية مكثفة", "استشارة فردية"],
    badge: "عرض خاص",
  },
  {
    id: "math-all",
    title: "رياضيات جميع المراحل - باقة شاملة",
    stage: "جميع المراحل",
    subject: "رياضيات",
    price: 199,
    description:
      "تغطية كاملة لمنهج الرياضيات لكل المراحل الثانوية بأسلوب مبسط وتدرج منطقي في الأفكار.",
    features: ["تحديث مستمر للمحتوى", "حل واجبات دورية", "دعم فني مباشر", "اختبارات تفاعلية"],
  },
];

export type Video = {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
};

export const videos: Video[] = [
  {
    id: "v1",
    youtubeId: "https://youtu.be/oKl5NccwNmQ?si=c2w4g7FhX7QAcy-2",
    title: "مقدمة في قوانين نيوتن للحركة",
    description: "شرح مبسط لقوانين نيوتن الثلاثة مع أمثلة تطبيقية.",
  },
  {
    id: "v2",
    youtubeId: "dQw4w9WgXcQ",
    title: "كيف تحل مسائل الكهرباء الساكنة؟",
    description: "استراتيجية خطوة بخطوة لحل أصعب مسائل الكهرباء الساكنة.",
  },
  {
    id: "v3",
    youtubeId: "dQw4w9WgXcQ",
    title: "المعادلات التفاضلية ببساطة",
    description: "تبسيط فكرة المعادلات وربطها بتطبيقات الفيزياء.",
  },
];

export type Testimonial = {
  id: string;
  name: string;
  stage: string;
  rating: number; // من 5
  comment: string;
  avatar?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "عبدالله الشمري",
    stage: "ثالث ثانوي - مسار علمي",
    rating: 5,
    comment:
      "أسلوب الأستاذ محمد في تبسيط الفيزياء غيّر نظرتي للمادة بالكامل، من مادة صعبة لمادة ممتعة.",
  },
  {
    id: "t2",
    name: "سارة القحطاني",
    stage: "ثاني ثانوي",
    rating: 5,
    comment:
      "المتابعة المستمرة وحل الواجبات أول بأول ساعدني أرفع درجاتي بشكل ملحوظ خلال فصل واحد.",
  },
  {
    id: "t3",
    name: "فيصل العتيبي",
    stage: "أول ثانوي",
    rating: 4,
    comment: "شرح منظم وهادئ، والأمثلة قريبة من نمط أسئلة الاختبارات فعليًا.",
  },
];

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "f1",
    question: "كيف تتم الدراسة؟ هل هي مباشرة أم مسجلة؟",
    answer:
      "تجمع الدورات بين حصص مباشرة أسبوعية عبر Zoom وفيديوهات مسجلة يمكن مشاهدتها في أي وقت لمراجعة الدروس.",
  },
  {
    id: "f2",
    question: "هل يوجد اختبارات ومتابعة لمستوى الطالب؟",
    answer:
      "نعم، تتضمن كل دورة اختبارات دورية وتقارير أداء دورية تُرسل لولي الأمر لمتابعة تطور الطالب أولًا بأول.",
  },
  {
    id: "f3",
    question: "ما وسائل الدفع المتاحة؟",
    answer:
      "يمكنك الدفع عبر التحويل البنكي أو Apple Pay أو مدى، وسيتم إرسال تفاصيل الدفع بعد التواصل عبر واتساب.",
  },
  {
    id: "f4",
    question: "هل يمكن الانضمام في أي وقت خلال الفصل الدراسي؟",
    answer:
      "بالتأكيد، يمكنك الانضمام في أي وقت وسيتم تزويدك بجميع التسجيلات السابقة للحاق بالمجموعة.",
  },
  {
    id: "f5",
    question: "هل تتوفر حصص فردية (خصوصي)؟",
    answer:
      "نعم، تتوفر حصص فردية بجدول مرن حسب توفر المواعيد، تواصل عبر واتساب لتحديد التفاصيل والسعر.",
  },
];

export const stats = {
  students: 128,
  courses: 9,
  hours: 500,
};

export const social = {
  whatsapp: "https://wa.me/96795248501",
  telegram: "https://t.me/mkhalil2723",
  facebook: "https://facebook.com/mohamedkhalil",
  instagram: "https://instagram.com/mohamedkhalil",
};
