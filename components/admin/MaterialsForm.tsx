"use client";

import { useState, type FormEvent } from "react";
import { FileUp, Video, Loader2, CheckCircle2 } from "lucide-react";

type Course = { id: string; title: string };

export default function MaterialsForm({ courses }: { courses: Course[] }) {
  const [pdfStatus, setPdfStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [videoStatus, setVideoStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handlePdfSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPdfStatus("loading");
    const formData = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/materials/upload", { method: "POST", body: formData });
    setPdfStatus(res.ok ? "done" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  async function handleVideoSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setVideoStatus("loading");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/videos/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: fd.get("courseId"),
        title: fd.get("title"),
        description: fd.get("description"),
        youtubeId: fd.get("youtubeId"),
      }),
    });
    setVideoStatus(res.ok ? "done" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  if (courses.length === 0) {
    return (
      <p className="card p-6 text-center text-sm text-navy-500 dark:text-navy-300">
        لا توجد دورات بعد بقاعدة البيانات - أضف دورة أولًا من Supabase (جدول courses).
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* رفع ملف PDF */}
      <form onSubmit={handlePdfSubmit} className="card space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-bold text-navy-900 dark:text-white">
          <FileUp size={18} className="text-orange-500" /> رفع ملف PDF
        </h2>
        <select name="courseId" required className="input-field">
          <option value="">اختر الدورة</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <input name="title" required placeholder="عنوان الملف (مثال: حل اختبار نصفي 2025)" className="input-field" />
        <input name="file" type="file" accept="application/pdf" required className="input-field" />
        <button type="submit" disabled={pdfStatus === "loading"} className="btn-primary w-full justify-center disabled:opacity-60">
          {pdfStatus === "loading" ? <Loader2 size={18} className="animate-spin" /> : pdfStatus === "done" ? <CheckCircle2 size={18} /> : <FileUp size={18} />}
          {pdfStatus === "done" ? "تم الرفع بنجاح" : "رفع الملف"}
        </button>
        {pdfStatus === "error" && <p className="text-sm text-red-500">فشل الرفع - تأكد أن الملف PDF وحاول مجددًا.</p>}
      </form>

      {/* إضافة فيديو */}
      <form onSubmit={handleVideoSubmit} className="card space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-bold text-navy-900 dark:text-white">
          <Video size={18} className="text-electric-500" /> إضافة فيديو شرح
        </h2>
        <select name="courseId" required className="input-field">
          <option value="">اختر الدورة</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <input name="title" required placeholder="عنوان الفيديو" className="input-field" />
        <input name="description" placeholder="وصف مختصر (اختياري)" className="input-field" />
        <input name="youtubeId" required placeholder="معرّف فيديو يوتيوب (بعد v=)" className="input-field" />
        <button type="submit" disabled={videoStatus === "loading"} className="btn-secondary w-full justify-center disabled:opacity-60">
          {videoStatus === "loading" ? <Loader2 size={18} className="animate-spin" /> : videoStatus === "done" ? <CheckCircle2 size={18} /> : <Video size={18} />}
          {videoStatus === "done" ? "تمت الإضافة" : "إضافة الفيديو"}
        </button>
        {videoStatus === "error" && <p className="text-sm text-red-500">فشلت الإضافة، حاول مجددًا.</p>}
      </form>
    </div>
  );
}
