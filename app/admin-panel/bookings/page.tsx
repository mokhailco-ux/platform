import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import BookingsManager from "@/components/admin/BookingsManager";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: bookingsRaw } = await admin
    .from("bookings")
    .select("id, type, status, student_note, created_at, user_id, session_slots(title, starts_at)")
    .order("created_at", { ascending: false });

  const userIds = Array.from(new Set((bookingsRaw ?? []).map((b) => b.user_id)));

  const { data: profilesData } = await admin
    .from("profiles")
    .select("id, full_name, phone")
    .in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);

  const profileMap = new Map((profilesData ?? []).map((p) => [p.id, p]));

  const bookings = (bookingsRaw ?? []).map((b) => ({
    ...b,
    profile: profileMap.get(b.user_id),
  })) as any[];

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-navy-900 dark:text-white">طلبات الحجز</h1>
      <BookingsManager bookings={bookings} />
    </div>
  );
}
