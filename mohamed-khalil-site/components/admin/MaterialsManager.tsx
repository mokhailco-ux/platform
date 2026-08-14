"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, FileText, Video } from "lucide-react";

type Course = { id: string; title: string };
type Material = {
  id: string;
  course_id: string;
  title: string;
  type: "pdf" | "video";
  created_at: string;
};

export default function MaterialsManager({
  courses,
  materials,
}: {
  courses: Course[];
  materials: Material[];
}) {
  const router = useRouter();
  const [type, setType] = useState<"pdf" | "video">("pdf");
  const [loading, setLoading] = useState(false);

  async function addMaterial(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/materials", { method: "POST", body: fd });
    setLoading(false);

    if (res.ok) {
      e.currentTarget.reset();
      setType("pdf");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "حدث خطأ، حاول مرة أخرى");
    }
  }

  async function deleteMaterial(id: string) {
    if (!confirm("متأكد من الحذف؟")) return;
    const res = await fetch("/api/admin/materials", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.refresh();
    else alert("تعذّر الحذف، حاول مرة أخرى");
  }

  const courseTitle = (id: string) => courses.find((c) => c.id === id)?.title ?? "—";

  return (
    <div className="space-y-8">
      <form onSubmit={addMaterial} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <select name="course_id" required className="input-field sm:col-span-2" defaultValue="">
          <option value="" disabled>
            اختر الدورة...
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as "pdf" | "video")}
          className="input-field sm:col-span-2"
        >
          <option value="pdf">ملف PDF</option>
          <option value="video">فيديو يوتيوب</option>
        </select>

        <input name="title" required placeholder="العنوان" className="input-field sm:col-span-2" />

        {type === "pdf" ? (
          <input name="file" type="file" accept="application/pdf" required className="input-field sm:col-span-2" />
        ) : (
          <input
            name="youtube_id"
            required
            placeholder="معرّف فيديو يوتيوب (مثال: dQw4w9WgXcQ)"
            className="input-field sm:col-span-2"
          />
        )}

        <button type="submit" disabled={loading} className="btn-primary justify-center sm:col-span-2">
          <Plus size={18} /> {loading ? "جارِ الرفع..." : "إضافة"}
        </button>
      </form>

      <div>
        <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">
          المحتوى الحالي ({materials.length})
        </h2>
        <ul className="space-y-2">
          {materials.map((m) => (
            <li key={m.id} className="card flex items-center justify-between p-4 text-sm">
              <div className="flex items-center gap-2 text-navy-800 dark:text-navy-100">
                {m.type === "pdf" ? (
                  <FileText size={15} className="shrink-0 text-orange-500" />
                ) : (
                  <Video size={15} className="shrink-0 text-electric-500" />
                )}
                <span>
                  {m.title} — {courseTitle(m.course_id)}
                </span>
              </div>
              <button
                onClick={() => deleteMaterial(m.id)}
                className="text-red-500 hover:text-red-600"
                aria-label="حذف"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
          {materials.length === 0 && <p className="text-sm text-navy-400">لا يوجد محتوى مرفوع بعد.</p>}
        </ul>
      </div>
    </div>
  );
}
