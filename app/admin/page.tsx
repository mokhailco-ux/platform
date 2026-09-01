"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Plus, Trash2, Lock, LayoutDashboard } from "lucide-react";
import { courses as baseCourses, videos as baseVideos, type Course, type Video } from "@/lib/data";

// ============================================================
// لوحة تحكم مبسطة لإضافة دورات وفيديوهات مستقبلًا.
// ملاحظة: هذه لوحة أساسية للتجربة السريعة فقط وتحفظ البيانات في
// المتصفح (localStorage). لاستخدام حقيقي يُنصح بربطها بقاعدة بيانات
// (مثل Supabase أو Postgres) ونظام تسجيل دخول آمن.
// ============================================================

const STORAGE_KEY_COURSES = "mk_extra_courses";
const STORAGE_KEY_VIDEOS = "mk_extra_videos";
const DASHBOARD_PASSWORD = "physics2026"; // غيّرها قبل النشر الفعلي

export default function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [extraCourses, setExtraCourses] = useState<Course[]>([]);
  const [extraVideos, setExtraVideos] = useState<Video[]>([]);
  const [tab, setTab] = useState<"courses" | "videos">("courses");

  useEffect(() => {
    const c = localStorage.getItem(STORAGE_KEY_COURSES);
    const v = localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (c) setExtraCourses(JSON.parse(c));
    if (v) setExtraVideos(JSON.parse(v));
  }, []);

  function persistCourses(list: Course[]) {
    setExtraCourses(list);
    localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(list));
  }
  function persistVideos(list: Video[]) {
    setExtraVideos(list);
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(list));
  }

  function addCourse(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newCourse: Course = {
      id: `extra-${Date.now()}`,
      title: String(fd.get("title")),
      stage: String(fd.get("stage")),
      subject: fd.get("subject") as Course["subject"],
      price: Number(fd.get("price")),
      description: String(fd.get("description")),
      features: String(fd.get("features")).split(",").map((f) => f.trim()).filter(Boolean),
    };
    persistCourses([...extraCourses, newCourse]);
    e.currentTarget.reset();
  }

  function addVideo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newVideo: Video = {
      id: `extra-${Date.now()}`,
      title: String(fd.get("title")),
      youtubeId: String(fd.get("youtubeId")),
      description: String(fd.get("description")),
    };
    persistVideos([...extraVideos, newVideo]);
    e.currentTarget.reset();
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === DASHBOARD_PASSWORD) setAuthed(true);
          }}
          className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-900 p-8 text-center"
        >
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
            <Lock size={20} />
          </span>
          <h1 className="mb-1 font-display text-xl font-bold text-white">لوحة التحكم</h1>
          <p className="mb-6 text-sm text-navy-400">أدخل كلمة المرور للمتابعة</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور"
            className="mb-4 w-full rounded-xl border border-navy-700 bg-navy-800 px-4 py-3 text-center text-white outline-none focus:border-orange-500"
          />
          <button type="submit" className="btn-primary w-full justify-center">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="flex items-center gap-3 border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <LayoutDashboard className="text-orange-500" />
        <h1 className="font-display text-lg font-bold text-navy-900 dark:text-white">
          لوحة التحكم - إضافة محتوى
        </h1>
      </header>

      <p className="mx-auto max-w-4xl px-5 pt-6 text-xs text-navy-400">
        ⚠️ ملاحظة: هذه اللوحة تعدّل بيانات تجريبية غير مرتبطة بصفحات الدول
        (/sa، /jo). لتعديل دورات وأسعار كل دولة فعليًا، عدّل ملف
        lib/countries.ts مباشرة.
      </p>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => setTab("courses")}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              tab === "courses" ? "bg-orange-500 text-white" : "bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300"
            }`}
          >
            الدورات
          </button>
          <button
            onClick={() => setTab("videos")}
            className={`rounded-full px-5 py-2 text-sm font-bold ${
              tab === "videos" ? "bg-orange-500 text-white" : "bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300"
            }`}
          >
            الفيديوهات
          </button>
        </div>

        {tab === "courses" && (
          <div className="space-y-8">
            <form onSubmit={addCourse} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <input name="title" required placeholder="عنوان الدورة" className="input-field" />
              <input name="stage" required placeholder="المرحلة الدراسية" className="input-field" />
              <select name="subject" className="input-field">
                <option value="فيزياء">فيزياء</option>
                <option value="رياضيات">رياضيات</option>
              </select>
              <input name="price" type="number" required placeholder="السعر (ر.س)" className="input-field" />
              <textarea
                name="description"
                required
                placeholder="وصف مختصر"
                className="input-field sm:col-span-2"
                rows={2}
              />
              <input
                name="features"
                placeholder="المميزات (افصل بينها بفاصلة)"
                className="input-field sm:col-span-2"
              />
              <button type="submit" className="btn-primary justify-center sm:col-span-2">
                <Plus size={18} /> إضافة الدورة
              </button>
            </form>

            <div>
              <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">
                الدورات الحالية ({baseCourses.length + extraCourses.length})
              </h2>
              <ul className="space-y-2">
                {[...baseCourses, ...extraCourses].map((c) => (
                  <li key={c.id} className="card flex items-center justify-between p-4 text-sm">
                    <span className="text-navy-800 dark:text-navy-100">
                      {c.title} — {c.price} ر.س
                    </span>
                    {extraCourses.find((ec) => ec.id === c.id) && (
                      <button
                        onClick={() => persistCourses(extraCourses.filter((ec) => ec.id !== c.id))}
                        className="text-red-500 hover:text-red-600"
                        aria-label="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === "videos" && (
          <div className="space-y-8">
            <form onSubmit={addVideo} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
              <input name="title" required placeholder="عنوان الفيديو" className="input-field sm:col-span-2" />
              <input
                name="youtubeId"
                required
                placeholder="معرّف فيديو يوتيوب (مثال: dQw4w9WgXcQ)"
                className="input-field sm:col-span-2"
              />
              <textarea
                name="description"
                required
                placeholder="وصف مختصر"
                className="input-field sm:col-span-2"
                rows={2}
              />
              <button type="submit" className="btn-primary justify-center sm:col-span-2">
                <Plus size={18} /> إضافة الفيديو
              </button>
            </form>

            <div>
              <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">
                الفيديوهات الحالية ({baseVideos.length + extraVideos.length})
              </h2>
              <ul className="space-y-2">
                {[...baseVideos, ...extraVideos].map((v) => (
                  <li key={v.id} className="card flex items-center justify-between p-4 text-sm">
                    <span className="text-navy-800 dark:text-navy-100">{v.title}</span>
                    {extraVideos.find((ev) => ev.id === v.id) && (
                      <button
                        onClick={() => persistVideos(extraVideos.filter((ev) => ev.id !== v.id))}
                        className="text-red-500 hover:text-red-600"
                        aria-label="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
