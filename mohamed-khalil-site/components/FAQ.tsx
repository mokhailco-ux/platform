"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data";

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <section id="faq" className="section-padding mx-auto max-w-3xl">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">الأسئلة الشائعة</span>
        <h2 className="font-display text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
          عندك سؤال؟ عندنا إجابة
        </h2>
      </div>

      <div className="mt-12 space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="card overflow-hidden">
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-navy-900 dark:text-white">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-orange-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 leading-7 text-navy-500 dark:text-navy-300">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
