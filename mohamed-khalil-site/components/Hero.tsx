"use client";

import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
import type { Country } from "@/lib/countries";

// عناصر عائمة تمثل رموز فيزيائية ورياضية - تجسّد هوية المادة العلمية
const floatingSymbols = [
  { s: "E = mc²", top: "18%", right: "8%", delay: 0 },
  { s: "F = ma", top: "70%", right: "14%", delay: 0.6 },
  { s: "λ = v/f", top: "30%", left: "6%", delay: 1.1 },
  { s: "∫f(x)dx", top: "75%", left: "10%", delay: 1.6 },
];

export default function Hero({ country }: { country: Country }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-24 pt-36 text-white sm:pt-44">
      {/* شبكة خلفية خفيفة توحي بورق الفيزياء المربّع */}
      <div className="absolute inset-0 bg-grid-physics bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950" />

      {/* الرموز العائمة */}
      {floatingSymbols.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 0.35, y: [0, -14, 0] }}
          transition={{ duration: 5, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ top: item.top, right: item.right, left: item.left }}
          className="absolute hidden font-mono text-lg text-electric-400 md:block"
        >
          {item.s}
        </motion.span>
      ))}

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          {country.heroLine}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl"
        >
          أتقن الفيزياء مع الأستاذ{" "}
          <span className="text-orange-500">محمد خليل</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg text-navy-200"
        >
          دروس أونلاين مبسطة في الفيزياء والرياضيات لجميع المراحل الثانوية،
          بأسلوب يحوّل المسائل المعقّدة إلى خطوات واضحة تصل بك لأعلى الدرجات.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a href="#courses" className="btn-primary">
            احجز الآن
            <ArrowLeft size={18} />
          </a>
          <a
            href={country.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !border-[#25D366]/40 !text-white hover:!border-[#25D366] hover:!text-[#25D366]"
          >
            <MessageCircle size={18} />
            تواصل عبر واتساب
          </a>
        </motion.div>
      </div>

      {/* موجة SVG متحركة توحي بموجة فيزيائية - العنصر المميز للتصميم */}
      <div className="relative mt-20 h-24 w-full overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 h-full w-full"
        >
          <motion.path
            d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
            fill="url(#waveGradient)"
            initial={{ x: 0 }}
            animate={{ x: [0, -60, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#FF7A29" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3AA0FF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </section>
  );
}
