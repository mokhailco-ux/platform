import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import SessionsManager from "@/components/admin/SessionsManager";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: slots } = await admin
    .from("session_slots")
    .select("id, type, title, starts_at, duration_minutes, capacity, booked_count, is_active")
    .eq("is_active", true)
    .order("starts_at", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-navy-900 dark:text-white">
        إدارة مواعيد الحجز
      </h1>
      <SessionsManager slots={slots ?? []} />
    </div>
  );
}
