"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Send as TelegramIcon, Facebook, Instagram, CheckCircle2 } from "lucide-react";
import { social } from "@/lib/data";
import type { Country } from "@/lib/countries";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact({ country }: { country: Country }) {
  const socialLinks = [
    { icon: MessageCircle, label: "واتساب", href: country.whatsapp, color: "#25D366" },
    { icon: TelegramIcon, label: "تيليجرام", href: social.telegram, color: "#26A5E4" },
    { icon: Facebook, label: "فيسبوك", href: social.facebook, color: "#1877F2" },
    { icon: Instagram, label: "إنستغرام", href: social.instagram, color: "#E1306C" },
  ];

  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setForm({ name: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="section-padding bg-navy-50/60 dark:bg-navy-900/30">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">تواصل معي</span>
          <h2 className="font-display text-3xl font-extrabold text-navy-900 dark:text-white sm:text-4xl">
            جاهز تبدأ؟ راسلني الآن
          </h2>
          <p className="mt-4 leading-7 text-navy-500 dark:text-navy-300">
            سواء عندك استفسار عن دورة، أو تحتاج خطة مذاكرة مناسبة لمستواك، أنا
            هنا للرد عليك في أقرب وقت.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-navy-200 bg-white px-5 py-3 text-sm font-bold text-navy-700 transition-all hover:-translate-y-0.5 dark:border-navy-700 dark:bg-navy-800 dark:text-white"
                style={{ ["--hover-color" as string]: s.color }}
                onMouseEnter={(e) => (e.currentTarget.style.color = s.color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                <s.icon size={17} />
                {s.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="card space-y-4 p-7"
        >
          <div>
            <label className="mb-1.5 block text-sm font-bold text-navy-700 dark:text-navy-200">
              الاسم
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="اسمك الكامل"
              className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-orange-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-navy-700 dark:text-navy-200">
              رقم الجوال
            </label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="05xxxxxxxx"
              className="w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-orange-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-navy-700 dark:text-navy-200">
              رسالتك
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="اكتب استفسارك هنا..."
              className="w-full resize-none rounded-xl border border-navy-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-orange-500 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-primary w-full justify-center disabled:opacity-60"
          >
            {status === "sent" ? (
              <>
                <CheckCircle2 size={18} /> تم الإرسال بنجاح
              </>
            ) : (
              <>
                <Send size={18} />
                {status === "sending" ? "جارِ الإرسال..." : "إرسال الرسالة"}
              </>
            )}
          </button>

          {status === "error" && (
            <p className="text-center text-sm text-red-500">
              حدث خطأ أثناء الإرسال، يرجى المحاولة عبر واتساب مباشرة.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
