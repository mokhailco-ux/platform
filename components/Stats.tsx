"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Users, BookOpen, Clock } from "lucide-react";
import { stats } from "@/lib/data";

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="font-mono">
      {value.toLocaleString("ar-SA")}+
    </span>
  );
}

const items = [
  { icon: Users, label: "طالب وطالبة", value: stats.students },
  { icon: BookOpen, label: "دورة تعليمية", value: stats.courses },
  { icon: Clock, label: "ساعة شرح", value: stats.hours },
];

export default function Stats() {
  return (
    <section className="border-y border-navy-100 bg-navy-50/60 dark:border-navy-800 dark:bg-navy-900/40">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-3 sm:px-8">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
              <item.icon size={22} />
            </span>
            <span className="text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
              <Counter to={item.value} />
            </span>
            <span className="mt-1 text-sm text-navy-500 dark:text-navy-300">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
