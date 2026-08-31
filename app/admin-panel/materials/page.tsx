import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAdminPage } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import MaterialsForm from "@/components/admin/MaterialsForm";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  await requireAdminPage();
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, title")
    .order("created_at", { ascending: true });

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <Link href="/admin-panel" className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300">
          <ArrowRight size={16} /> الرجوع
        </Link>
        <h1 className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">رفع محتوى</h1>
      </header>

      <div className="mx-auto max-w-2xl px-5 py-10">
        <MaterialsForm courses={courses ?? []} />
      </div>
    </div>
  );
}
