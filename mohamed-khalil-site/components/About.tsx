"use client";

import { motion } from "framer-motion";
import { GraduationCap, Lightbulb, Target, Users2 } from "lucide-react";

const strengths = [
  {
    icon: Lightbulb,
    title: "تبسيط المفاهيم",
    desc: "تحويل القوانين والمعادلات المعقدة إلى فكرة بسيطة يسهل تذكرها وتطبيقها.",
  },
  {
    icon: Target,
    title: "التركيز على الاختبارات",
    desc: "تدريب مكثف على نمط أسئلة الوزارة والقدرات والتحصيلي.",
  },
  {
    icon: Users2,
    title: "متابعة فردية",
    desc: "تقييم مستمر لأداء كل طالب وتقديم خطة مراجعة تناسب مستواه.",
  },
  {
    icon: GraduationCap,
    title: "خبرة تدريسية",
    desc: "سنوات من التدريس أونلاين لطلاب الثانوية العامة في السعودية.",
  },
];

export default function About() {
  return (
    <section id="about" className="section-padding mx-auto max-w-6xl">
      <div className="grid grid-cols-1 items-start gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">نبذة عني</span>
          <h2 className="font-display text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
            الفيزياء ليست حفظًا.. هي طريقة تفكير
          </h2>
          <p className="mt-5 leading-8 text-navy-600 dark:text-navy-300">
            أنا الأستاذ محمد خليل، مدرس فيزياء ورياضيات أونلاين متخصص في تدريس
            طلاب الثانوية العامة بالمملكة العربية السعودية. أؤمن أن أي طالب
            يستطيع التفوق في الفيزياء والرياضيات إذا فهم الفكرة قبل الحفظ،
            لذلك أبني كل درس على أساس منطقي متسلسل يربط القانون بمعناه الفعلي
            قبل تطبيقه في المسائل.
          </p>
          <p className="mt-4 leading-8 text-navy-600 dark:text-navy-300">
            أسلوبي في التدريس يعتمد على التفاعل المباشر، حل نماذج حقيقية من
            الاختبارات، ومتابعة دقيقة لتقدم كل طالب حتى يصل لأعلى مستوياته.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {strengths.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-6"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-electric-500/10 text-electric-500">
                <item.icon size={20} />
              </span>
              <h3 className="mb-2 font-bold text-navy-900 dark:text-white">{item.title}</h3>
              <p className="text-sm leading-6 text-navy-500 dark:text-navy-300">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
