import Link from "next/link";
import { requireAdminPage } from "@/lib/admin";
import { FileUp, CalendarPlus, ClipboardCheck, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPanelHome() {
  const { profile } = await requireAdminPage();

  const cards = [
    {
      href: "/admin-panel/materials",
      icon: FileUp,
      title: "رفع محتوى",
      desc: "ملفات PDF (حلول اختبارات، ملازم) وفيديوهات إضافية لكل دورة",
    },
    {
      href: "/admin-panel/sessions",
      icon: CalendarPlus,
      title: "مواعيد الحصص",
      desc: "أضف مواعيد حصص خصوصية أو جماعية أو استشارات للحجز",
    },
    {
      href: "/admin-panel/bookings",
      icon: ClipboardCheck,
      title: "طلبات الحجز",
      desc: "وافق أو ارفض طلبات حجز الحصص الواردة من الطلاب",
    },
  ];

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="flex items-center justify-between border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <div>
          <h1 className="font-display text-lg font-bold text-navy-900 dark:text-white">
            لوحة الإدارة
          </h1>
          <p className="text-xs text-navy-400">مرحبًا {profile?.full_name ?? "أستاذ محمد"}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="flex items-center gap-2 text-sm font-bold text-navy-500 hover:text-red-500 dark:text-navy-300">
            <LogOut size={16} /> خروج
          </button>
        </form>
      </header>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 px-5 py-10 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card p-6 transition-transform hover:-translate-y-1">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <c.icon size={22} />
            </span>
            <h2 className="mb-2 font-bold text-navy-900 dark:text-white">{c.title}</h2>
            <p className="text-sm leading-6 text-navy-500 dark:text-navy-300">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
