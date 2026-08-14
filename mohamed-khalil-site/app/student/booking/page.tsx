import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import BookingRequestForm from "@/components/BookingRequestForm";

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: slots } = await admin
    .from("session_slots")
    .select("id, type, title, starts_at, duration_minutes, capacity, booked_count")
    .eq("is_active", true)
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  const { data: myBookings } = await admin
    .from("bookings")
    .select("id, status, slot_id, session_slots(title, starts_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <Link href="/student" className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300">
          <ArrowRight size={16} /> الرجوع لدوراتي
        </Link>
        <h1 className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">حجز حصة</h1>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        <BookingRequestForm slots={(slots as any) ?? []} bookings={(myBookings as any) ?? []} />
      </div>
    </div>
  );
}
