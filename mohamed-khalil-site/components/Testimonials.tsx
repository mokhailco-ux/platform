"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-padding bg-navy-50/60 dark:bg-navy-900/30">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">آراء الطلاب</span>
          <h2 className="font-display text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
            ماذا يقول طلابي؟
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card flex flex-col p-6"
            >
              <Quote size={26} className="mb-3 text-orange-500/40" />
              <p className="flex-1 text-sm leading-7 text-navy-600 dark:text-navy-200">
                {t.comment}
              </p>

              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={idx < t.rating ? "fill-gold text-gold" : "text-navy-200 dark:text-navy-600"}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-navy-100 pt-4 dark:border-navy-700">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-500/10 font-bold text-electric-500">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy-900 dark:text-white">{t.name}</p>
                  <p className="text-xs text-navy-400 dark:text-navy-400">{t.stage}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
