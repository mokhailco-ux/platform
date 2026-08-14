"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Users, MessageCircle, Clock, CheckCircle2, XCircle } from "lucide-react";

type Slot = {
  id: string;
  type: "private" | "group" | "consultation";
  title: string;
  starts_at: string;
  duration_minutes: number;
  capacity: number;
  booked_count: number;
};

type Booking = {
  id: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  slot_id: string;
  session_slots: { title: string; starts_at: string } | null;
};

const typeMeta: Record<string, { label: string; icon: typeof User }> = {
  private: { label: "خصوصي", icon: User },
  group: { label: "جماعي", icon: Users },
  consultation: { label: "استشارة", icon: MessageCircle },
};

const statusMeta: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "بانتظار الموافقة", className: "text-gold", icon: Clock },
  approved: { label: "تمت الموافقة ✓", className: "text-emerald-500", icon: CheckCircle2 },
  rejected: { label: "مرفوض", className: "text-red-500", icon: XCircle },
  cancelled: { label: "ملغى", className: "text-navy-400", icon: XCircle },
};

export default function BookingRequestForm({ slots, bookings }: { slots: Slot[]; bookings: Booking[] }) {
  const router = useRouter();
  const [noteBySlot, setNoteBySlot] = useState<Record<string, string>>({});
  const [loadingSlot, setLoadingSlot] = useState<string | null>(null);

  const bookedSlotIds = new Set(
    bookings.filter((b) => b.status === "pending" || b.status === "approved").map((b) => b.slot_id)
  );

  async function requestBooking(slotId: string) {
    setLoadingSlot(slotId);
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slot_id: slotId, student_note: noteBySlot[slotId] || "" }),
    });
    setLoadingSlot(null);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      router.refresh();
    } else {
      alert(data.error || "حدث خطأ، حاول مرة أخرى");
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-4 font-bold text-navy-800 dark:text-navy-200">المواعيد المتاحة</h2>
        <div className="space-y-3">
          {slots.map((s) => {
            const meta = typeMeta[s.type];
            const Icon = meta.icon;
            const full = s.booked_count >= s.capacity;
            const alreadyRequested = bookedSlotIds.has(s.id);

            return (
              <div key={s.id} className="card p-5">
                <div className="flex items-start gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-bold text-navy-900 dark:text-white">
                      {s.title} — {meta.label}
                    </p>
                    <p className="text-xs text-navy-400">
                      {new Date(s.starts_at).toLocaleString("ar-SA")} • {s.duration_minutes} دقيقة •{" "}
                      {Math.max(s.capacity - s.booked_count, 0)} مقعد متبقي
                    </p>
                  </div>
                </div>

                {alreadyRequested ? (
                  <p className="mt-3 text-xs font-bold text-electric-500">لديك طلب على هذا الموعد بالفعل</p>
                ) : full ? (
                  <p className="mt-3 text-xs font-bold text-red-500">اكتملت المقاعد</p>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      placeholder="ملاحظة (اختياري)"
                      className="input-field flex-1"
                      value={noteBySlot[s.id] || ""}
                      onChange={(e) => setNoteBySlot({ ...noteBySlot, [s.id]: e.target.value })}
                    />
                    <button
                      onClick={() => requestBooking(s.id)}
                      disabled={loadingSlot === s.id}
                      className="btn-primary !py-2.5 text-sm"
                    >
                      {loadingSlot === s.id ? "جارِ الإرسال..." : "طلب حجز"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {slots.length === 0 && (
            <p className="text-sm text-navy-400">لا توجد مواعيد متاحة حاليًا، تابعنا لاحقًا.</p>
          )}
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-bold text-navy-800 dark:text-navy-200">طلباتي</h2>
        <ul className="space-y-2">
          {bookings.map((b) => {
            const sm = statusMeta[b.status] ?? statusMeta.pending;
            const Icon = sm.icon;
            return (
              <li key={b.id} className="card flex items-center justify-between p-4 text-sm">
                <span className="text-navy-800 dark:text-navy-100">
                  {b.session_slots?.title}
                  {b.session_slots ? ` — ${new Date(b.session_slots.starts_at).toLocaleString("ar-SA")}` : ""}
                </span>
                <span className={`flex items-center gap-1 font-bold ${sm.className}`}>
                  <Icon size={14} /> {sm.label}
                </span>
              </li>
            );
          })}
          {bookings.length === 0 && <p className="text-sm text-navy-400">لم تطلب أي حجز بعد.</p>}
        </ul>
      </div>
    </div>
  );
}
