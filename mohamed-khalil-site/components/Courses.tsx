"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import type { Country } from "@/lib/countries";

export default function Courses({ country }: { country: Country }) {
  return (
    <section id="courses" className="section-padding bg-navy-50/60 dark:bg-navy-900/30">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">الدورات التعليمية</span>
          <h2 className="font-display text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
            اختر دورتك وابدأ رحلتك نحو التفوق
          </h2>
          <p className="mt-4 text-navy-500 dark:text-navy-300">
            دورات مصممة خصيصًا لكل مرحلة دراسية، مع متابعة مستمرة وحل تمارين مكثف.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {country.courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card relative flex flex-col p-6"
            >
              {course.badge && (
                <span className="absolute -top-3 right-6 flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                  <Sparkles size={12} />
                  {course.badge}
                </span>
              )}

              <span className="w-fit rounded-full bg-electric-500/10 px-3 py-1 text-xs font-bold text-electric-500">
                {course.subject} • {course.stage}
              </span>

              <h3 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-white">
                {course.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-navy-500 dark:text-navy-300">
                {course.description}
              </p>

              <ul className="mt-5 space-y-2">
                {course.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-navy-600 dark:text-navy-200">
                    <Check size={15} className="shrink-0 text-orange-500" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-extrabold text-navy-900 dark:text-white">
                  {course.price} {country.currency}
                </span>
                {course.oldPrice && (
                  <span className="font-mono text-sm text-navy-400 line-through">
                    {course.oldPrice} {country.currency}
                  </span>
                )}
              </div>

              <a
                href="/signup"
                className="btn-primary mt-6 w-full justify-center !py-3 text-sm"
              >
                سجّل وابدأ فترة مجانية
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
