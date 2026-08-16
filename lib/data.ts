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
    youtubeId: "https://youtu.be/oKl5NccwNmQ?si=Sa1llB9BsA7uhmaE",
    title: "مقدمة في قوانين نيوتن للحركة",
    description: "شرح مبسط لقوانين نيوتن الثلاثة مع أمثلة تطبيقية.",
  },
  {
    id: "v2",
    youtubeId: "https://youtu.be/oKl5NccwNmQ?si=Sa1llB9BsA7uhmaE",
    title: "كيف تحل مسائل الكهرباء الساكنة؟",
    description: "استراتيجية خطوة بخطوة لحل أصعب مسائل الكهرباء الساكنة.",
  },
  {
    id: "v3",
    youtubeId: "https://youtu.be/oKl5NccwNmQ?si=Sa1llB9BsA7uhmaE",
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
  students:+128,
  courses: +12 ,
  hours: + 500 ,
};

export const social = {
  whatsapp: "https://wa.me/962795248501",
  telegram: "https://t.me/mkhalil2723",
  facebook: "https://facebook.com/mohamedkhalil",
  instagram: "https://instagram.com/mohamedkhalil",
};
