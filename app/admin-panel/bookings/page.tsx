import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAdminPage } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";
import BookingActions from "@/components/admin/BookingActions";

export const dynamic = "force-dynamic";

type BookingRow = {
  id: string;
  status: string;
  note: string | null;
  created_at: string;
  user_id: string;
  session_slots: { title: string; start_time: string; type: string } | null;
};

export default async function BookingsPage() {
  await requireAdminPage();
  const admin = createAdminClient();

  const { data: bookings } = await admin
    .from("bookings")
    .select("id, status, note, created_at, user_id, session_slots(title, start_time, type)")
    .order("created_at", { ascending: false })
    .returns<BookingRow[]>();

  const userIds = [...new Set((bookings ?? []).map((b) => b.user_id))];
  const { data: profiles } = userIds.length
    ? await admin.from("profiles").select("id, full_name, phone").in("id", userIds)
    : { data: [] };

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));

  const pending = (bookings ?? []).filter((b) => b.status === "pending");
  const others = (bookings ?? []).filter((b) => b.status !== "pending");

  const statusLabel: Record<string, string> = {
    pending: "بانتظار الموافقة",
    confirmed: "مؤكّد ✅",
    rejected: "مرفوض ❌",
    cancelled: "ملغي",
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <Link href="/admin-panel" className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300">
          <ArrowRight size={16} /> الرجوع
        </Link>
        <h1 className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">طلبات الحجز</h1>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10 space-y-8">
        <div>
          <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">بانتظار الموافقة ({pending.length})</h2>
          <div className="space-y-3">
            {pending.map((b) => {
              const profile = profileMap.get(b.user_id);
              return (
                <div key={b.id} className="card p-5">
                  <p className="font-bold text-navy-900 dark:text-white">{b.session_slots?.title}</p>
                  <p className="text-xs text-navy-400">
                    {b.session_slots?.start_time && new Date(b.session_slots.start_time).toLocaleString("ar-SA")}
                  </p>
                  <p className="mt-2 text-sm text-navy-600 dark:text-navy-200">
                    الطالب: {profile?.full_name ?? "غير معروف"} — {profile?.phone ?? "بدون رقم"}
                  </p>
                  {b.note && <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">ملاحظة: {b.note}</p>}
                  <BookingActions bookingId={b.id} />
                </div>
              );
            })}
            {pending.length === 0 && <p className="text-center text-sm text-navy-400">لا توجد طلبات بانتظار الموافقة.</p>}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">طلبات سابقة</h2>
          <div className="space-y-2">
            {others.map((b) => (
              <div key={b.id} className="card flex items-center justify-between p-4 text-sm">
                <span className="text-navy-700 dark:text-navy-200">{b.session_slots?.title}</span>
                <span className="text-xs font-bold text-navy-400">{statusLabel[b.status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
