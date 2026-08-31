import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAdminPage } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import SessionsForm from "@/components/admin/SessionsForm";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  await requireAdminPage();
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("created_at", { ascending: true });

  const { data: slots } = await supabase
    .from("session_slots")
    .select("id, title, type, start_time, capacity")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <Link href="/admin-panel" className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300">
          <ArrowRight size={16} /> الرجوع
        </Link>
        <h1 className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">مواعيد الحصص</h1>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10 space-y-8">
        <SessionsForm courses={courses ?? []} />

        <div>
          <h2 className="mb-3 font-bold text-navy-800 dark:text-navy-200">المواعيد القادمة ({slots?.length ?? 0})</h2>
          <ul className="space-y-2">
            {(slots ?? []).map((s) => (
              <li key={s.id} className="card flex items-center justify-between p-4 text-sm">
                <span className="text-navy-800 dark:text-navy-100">
                  {s.title} — {new Date(s.start_time).toLocaleString("ar-SA")}
                </span>
                <span className="rounded-full bg-electric-500/10 px-3 py-1 text-xs font-bold text-electric-500">
                  {s.type === "private" ? "خصوصي" : s.type === "consultation" ? "استشارة" : "جماعي"} · سعة {s.capacity}
                </span>
              </li>
            ))}
            {(!slots || slots.length === 0) && (
              <p className="text-center text-sm text-navy-400">لا توجد مواعيد قادمة بعد.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
