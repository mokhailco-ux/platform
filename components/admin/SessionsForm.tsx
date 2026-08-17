"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2, CheckCircle2 } from "lucide-react";

type Course = { id: string; title: string };

export default function SessionsForm({ courses }: { courses: Course[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget);
    const start = fd.get("startTime") as string;
    const durationMin = Number(fd.get("duration"));
    const endTime = new Date(new Date(start).getTime() + durationMin * 60000).toISOString();

    const res = await fetch("/api/admin/sessions/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: fd.get("title"),
        type: fd.get("type"),
        courseId: fd.get("courseId") || null,
        startTime: new Date(start).toISOString(),
        endTime,
        capacity: Number(fd.get("capacity")) || 1,
      }),
    });

    setStatus(res.ok ? "done" : "error");
    if (res.ok) {
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="flex items-center gap-2 font-bold text-navy-900 dark:text-white">
        <CalendarPlus size={18} className="text-orange-500" /> إضافة موعد جديد
      </h2>

      <input name="title" required placeholder="عنوان الحصة (مثال: مراجعة الوحدة الثالثة)" className="input-field" />

      <div className="grid grid-cols-2 gap-3">
        <select name="type" required className="input-field">
          <option value="group">حصة جماعية</option>
          <option value="private">حصة خصوصية</option>
          <option value="consultation">استشارة/تجربة</option>
        </select>
        <input name="capacity" type="number" min={1} defaultValue={1} placeholder="عدد المقاعد" className="input-field" />
      </div>

      <select name="courseId" className="input-field">
        <option value="">بدون ربط بدورة معينة (اختياري)</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input name="startTime" type="datetime-local" required className="input-field" />
        <input name="duration" type="number" min={15} step={15} defaultValue={60} placeholder="المدة (دقيقة)" className="input-field" />
      </div>

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center disabled:opacity-60">
        {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : status === "done" ? <CheckCircle2 size={18} /> : <CalendarPlus size={18} />}
        {status === "done" ? "تمت الإضافة" : "إضافة الموعد"}
      </button>
      {status === "error" && <p className="text-sm text-red-500">فشلت الإضافة، تأكد من كل الحقول وحاول مجددًا.</p>}
    </form>
  );
}
