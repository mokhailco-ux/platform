"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { videos } from "@/lib/data";

// لإضافة فيديو جديد: أضف عنصرًا جديدًا في مصفوفة videos داخل lib/data.ts
export default function Videos() {
  return (
    <section id="videos" className="section-padding mx-auto max-w-6xl">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">مكتبة الفيديوهات</span>
        <h2 className="font-display text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
          شاهد نماذج من الشرح
        </h2>
        <p className="mt-4 text-navy-500 dark:text-navy-300">
          مجموعة من الفيديوهات التعليمية المجانية لتتعرف على أسلوب الشرح قبل التسجيل.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="card overflow-hidden"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-navy-800">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="p-5">
              <h3 className="flex items-start gap-2 font-bold text-navy-900 dark:text-white">
                <PlayCircle size={18} className="mt-0.5 shrink-0 text-orange-500" />
                {video.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-navy-500 dark:text-navy-300">
                {video.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
