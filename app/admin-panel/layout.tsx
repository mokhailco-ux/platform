import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { LayoutDashboard, CalendarClock, ClipboardCheck, FileText, LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin-panel", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin-panel/sessions", label: "المواعيد", icon: CalendarClock },
  { href: "/admin-panel/bookings", label: "طلبات الحجز", icon: ClipboardCheck },
  { href: "/admin-panel/materials", label: "الملفات والفيديوهات", icon: FileText },
];

// كل صفحات /admin-panel/** محمية بهذا الليّاوت: أي زائر غير مسجّل دخوله
// يُحوّل لصفحة تسجيل الدخول، وأي مستخدم مسجّل لكن ليس أدمن يُحوّل لمنصة الطلاب.
export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="flex items-center justify-between border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <div className="flex items-center gap-2 font-display font-extrabold text-navy-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-white/20">
            <LayoutDashboard size={16} />
          </span>
          لوحة تحكم أ. {profile?.full_name?.split(" ")[0] ?? "محمد"}
        </div>
        <form action="/api/auth/logout" method="POST">
          <button className="flex items-center gap-2 text-sm font-bold text-navy-500 hover:text-red-500 dark:text-navy-300">
            <LogOut size={16} /> تسجيل خروج
          </button>
        </form>
      </header>

      <nav className="mx-auto flex max-w-5xl gap-2 overflow-x-auto px-5 pt-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex shrink-0 items-center gap-2 rounded-full border border-navy-200 px-4 py-2 text-sm font-bold text-navy-600 transition-colors hover:border-orange-500 hover:text-orange-500 dark:border-navy-700 dark:text-navy-200"
          >
            <item.icon size={15} /> {item.label}
          </Link>
        ))}
      </nav>

      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
