"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock, User, Users, MessageCircle } from "lucide-react";

type Booking = {
  id: string;
  type: "private" | "group" | "consultation";
  status: "pending" | "approved" | "rejected" | "cancelled";
  student_note: string | null;
  created_at: string;
  session_slots: { title: string; starts_at: string } | null;
  profile?: { full_name: string | null; phone: string | null };
};

const typeLabels: Record<string, { label: string; icon: typeof User }> = {
  private: { label: "خصوصي", icon: User },
  group: { label: "جماعي", icon: Users },
  consultation: { label: "استشارة", icon: MessageCircle },
};

const statusStyles: Record<string, string> = {
  pending: "bg-gold/15 text-gold",
  approved: "bg-emerald-500/10 text-emerald-500",
  rejected: "bg-red-500/10 text-red-500",
  cancelled: "bg-navy-200 text-navy-500",
};

const statusLabels: Record<string, string> = {
  pending: "بانتظار الموافقة",
  approved: "تمت الموافقة",
  rejected: "مرفوض",
  cancelled: "ملغى",
};

export default function BookingsManager({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function decide(id: string, status: "approved" | "rejected") {
    setLoadingId(id);
    const res = await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setLoadingId(null);
    if (res.ok) router.refresh();
    else alert("حدث خطأ، حاول مرة أخرى");
  }

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              filter === f
                ? "bg-orange-500 text-white"
                : "bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300"
            }`}
          >
            {f === "all" ? "الكل" : statusLabels[f]}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {filtered.map((b) => {
          const meta = typeLabels[b.type];
          const Icon = meta.icon;
          return (
            <li key={b.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Icon size={18} className="mt-0.5 shrink-0 text-orange-500" />
                  <div>
                    <p className="font-bold text-navy-900 dark:text-white">
                      {b.profile?.full_name ?? "طالب"} — {meta.label}
                    </p>
                    <p className="text-xs text-navy-400">
                      {b.session_slots?.title}
                      {b.session_slots ? ` • ${new Date(b.session_slots.starts_at).toLocaleString("ar-SA")}` : ""}
                    </p>
                    {b.profile?.phone && <p className="text-xs text-navy-400">📱 {b.profile.phone}</p>}
                    {b.student_note && (
                      <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">ملاحظة الطالب: {b.student_note}</p>
                    )}
                  </div>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[b.status]}`}>
                  {statusLabels[b.status]}
                </span>
              </div>

              {b.status === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => decide(b.id, "approved")}
                    disabled={loadingId === b.id}
                    className="flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-600 disabled:opacity-60"
                  >
                    <Check size={14} /> موافقة
                  </button>
                  <button
                    onClick={() => decide(b.id, "rejected")}
                    disabled={loadingId === b.id}
                    className="flex items-center gap-1 rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                  >
                    <X size={14} /> رفض
                  </button>
                </div>
              )}
            </li>
          );
        })}
        {filtered.length === 0 && (
          <p className="flex items-center gap-2 text-sm text-navy-400">
            <Clock size={14} /> لا توجد طلبات هنا حاليًا.
          </p>
        )}
      </ul>
    </div>
  );
}
