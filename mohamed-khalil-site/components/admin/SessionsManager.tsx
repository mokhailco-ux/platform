"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Users, User, MessageCircle } from "lucide-react";

type Slot = {
  id: string;
  type: "private" | "group" | "consultation";
  title: string;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  booked_count: number;
  is_active: boolean;
};

const typeLabels: Record<Slot["type"], { label: string; icon: typeof User }> = {
  private: { label: "خصوصي", icon: User },
  group: { label: "جماعي", icon: Users },
  consultation: { label: "استشارة", icon: MessageCircle },
};

export default function SessionsManager({ slots }: { slots: Slot[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function addSlot(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: fd.get("type"),
        title: fd.get("title"),
        starts_at: fd.get("starts_at"),
        duration_minutes: Number(fd.get("duration_minutes")),
        capacity: Number(fd.get("capacity")),
        notes: fd.get("notes"),
      }),
    });

    setLoading(false);
    if (res.ok) {
      e.currentTarget.reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "حدث خطأ، حاول مرة أخرى");
    }
  }

  async function deleteSlot(id: string) {
    if (!confirm("متأكد من حذف هذا الموعد؟")) return;
    const res = await fetch("/api/admin/sessions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) router.refresh();
    else alert("تعذّر الحذف، حاول مرة أخرى");
  }

  return (
    <div className="space-y-8">
      <form onSubmit={addSlot} className="card grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
        <select name="type" className="input-field" required defaultValue="private">
          <option value="private">خصوصي</option>
          <option value="group">جماعي</option>
          <option value="consultation">استشارة</option>
        </select>
        <input name="title" required placeholder="عنوان الموعد" className="input-field" />
        <input name="starts_at" type="datetime-local" required className="input-field" />
        <input
          name="duration_minutes"
          type="number"
          min={15}
          defaultValue={60}
          placeholder="مدة الحصة (دقيقة)"
          className="input-field"
        />
        <input
          name="capacity"
          type="number"
          min={1}
          defaultValue={1}
          placeholder="عدد المقاعد"
          className="input-field"
        />
        <input name="notes" placeholder="ملاحظات (اختياري)" className="input-field sm:col-span-2" />
        <button type="submit" disabled={loading} className="btn-primary justify-center sm:col-span-2">
          <Plus size={18} /> {loading ? "جارِ الإضافة..." : "إضافة الموعد"}
        </button>
      </form>

      <div>
        <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">
          المواعيد الحالية ({slots.length})
        </h2>
        <ul className="space-y-2">
          {slots.map((s) => {
            const meta = typeLabels[s.type];
            const Icon = meta.icon;
            return (
              <li key={s.id} className="card flex items-center justify-between gap-3 p-4 text-sm">
                <div className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0 text-orange-500" />
                  <div>
                    <p className="font-bold text-navy-800 dark:text-navy-100">
                      {s.title} — {meta.label}
                    </p>
                    <p className="text-xs text-navy-400">
                      {new Date(s.starts_at).toLocaleString("ar-SA")} • {s.duration_minutes} دقيقة •{" "}
                      {s.booked_count}/{s.capacity} محجوز
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteSlot(s.id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            );
          })}
          {slots.length === 0 && <p className="text-sm text-navy-400">لا توجد مواعيد بعد.</p>}
        </ul>
      </div>
    </div>
  );
}
