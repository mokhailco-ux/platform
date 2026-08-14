import { createAdminClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import MaterialsManager from "@/components/admin/MaterialsManager";

export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: courses } = await admin
    .from("courses")
    .select("id, title")
    .order("created_at", { ascending: true });

  const { data: materials } = await admin
    .from("course_materials")
    .select("id, course_id, title, type, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 font-display text-xl font-bold text-navy-900 dark:text-white">
        الملفات والفيديوهات
      </h1>
      <MaterialsManager courses={courses ?? []} materials={materials ?? []} />
    </div>
  );
}
