import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight, Users, Clock } from "lucide-react";
import BookingRequestButton from "@/components/BookingRequestButton";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  private: "حصة خصوصية",
  group: "حصة جماعية",
  consultation: "استشارة / تجربة",
};

export default async function BookingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/student/booking");

  const { data: slots } = await supabase
    .from("session_slots")
    .select("id, title, type, start_time, capacity")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  const slotIds = (slots ?? []).map((s) => s.id);
  const { data: confirmedBookings } = slotIds.length
    ? await supabase.from("bookings").select("slot_id").eq("status", "confirmed").in("slot_id", slotIds)
    : { data: [] };

  const { data: myBookings } = await supabase
    .from("bookings")
    .select("id, status, slot_id, session_slots(title, start_time)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const confirmedCountBySlot = new Map<string, number>();
  (confirmedBookings ?? []).forEach((b) => {
    confirmedCountBySlot.set(b.slot_id, (confirmedCountBySlot.get(b.slot_id) ?? 0) + 1);
  });

  const myBookedSlotIds = new Set((myBookings ?? []).map((b: any) => b.slot_id));

  const statusLabel: Record<string, string> = {
    pending: "بانتظار الموافقة ⏳",
    confirmed: "مؤكّد ✅",
    rejected: "مرفوض ❌",
    cancelled: "ملغي",
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <Link href="/student" className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300">
          <ArrowRight size={16} /> الرجوع لدوراتي
        </Link>
        <h1 className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">حجز حصة</h1>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10 space-y-10">
        <div>
          <h2 className="mb-4 font-bold text-navy-800 dark:text-navy-200">المواعيد المتاحة</h2>
          <div className="space-y-3">
            {(slots ?? []).map((slot) => {
              const taken = confirmedCountBySlot.get(slot.id) ?? 0;
              const remaining = slot.capacity - taken;
              const alreadyRequested = myBookedSlotIds.has(slot.id);

              return (
                <div key={slot.id} className="card p-5">
                  <span className="w-fit rounded-full bg-electric-500/10 px-3 py-1 text-xs font-bold text-electric-500">
                    {typeLabel[slot.type] ?? slot.type}
                  </span>
                  <p className="mt-2 font-bold text-navy-900 dark:text-white">{slot.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-navy-500 dark:text-navy-300">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {new Date(slot.start_time).toLocaleString("ar-SA")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={13} /> {remaining > 0 ? `${remaining} مقعد متبقي` : "مكتمل"}
                    </span>
                  </div>

                  {alreadyRequested ? (
                    <p className="mt-4 text-sm font-bold text-orange-500">أرسلت طلب حجز لهذا الموعد</p>
                  ) : remaining > 0 ? (
                    <BookingRequestButton slotId={slot.id} />
                  ) : (
                    <p className="mt-4 text-sm font-bold text-red-500">المقاعد مكتملة</p>
                  )}
                </div>
              );
            })}
            {(!slots || slots.length === 0) && (
              <p className="text-center text-sm text-navy-400">لا توجد مواعيد متاحة حاليًا، تابع لاحقًا.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="mb-4 font-bold text-navy-800 dark:text-navy-200">حجوزاتي</h2>
          <div className="space-y-2">
            {(myBookings ?? []).map((b: any) => (
              <div key={b.id} className="card flex items-center justify-between p-4 text-sm">
                <span className="text-navy-700 dark:text-navy-200">{b.session_slots?.title}</span>
                <span className="text-xs font-bold text-navy-500">{statusLabel[b.status]}</span>
              </div>
            ))}
            {(!myBookings || myBookings.length === 0) && (
              <p className="text-center text-sm text-navy-400">ما عندك طلبات حجز بعد.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
