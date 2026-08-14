import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { CalendarClock, ClipboardCheck, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  await requireAdmin();
  const admin = createAdminClient();

  const [{ count: pendingCount }, { count: slotsCount }, { count: materialsCount }] = await Promise.all([
    admin.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("session_slots").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("course_materials").select("id", { count: "exact", head: true }),
  ]);

  const cards = [
    {
      href: "/admin-panel/bookings",
      label: "طلبات حجز بانتظار الموافقة",
      value: pendingCount ?? 0,
      icon: ClipboardCheck,
    },
    {
      href: "/admin-panel/sessions",
      label: "مواعيد متاحة حاليًا",
      value: slotsCount ?? 0,
      icon: CalendarClock,
    },
    {
      href: "/admin-panel/materials",
      label: "ملفات وفيديوهات مرفوعة",
      value: materialsCount ?? 0,
      icon: FileText,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {cards.map((c) => (
        <Link
          key={c.href}
          href={c.href}
          className="card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/10 dark:hover:shadow-black/40"
        >
          <c.icon className="text-orange-500" />
          <p className="mt-4 font-mono text-3xl font-extrabold text-navy-900 dark:text-white">{c.value}</p>
          <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">{c.label}</p>
        </Link>
      ))}
    </div>
  );
}
