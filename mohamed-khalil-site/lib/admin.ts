import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// ================================================================
// نظام صلاحيات الأدمن الحقيقي (profiles.is_admin) - منفصل تمامًا عن
// باسورد /admin القديم. أي مستخدم عادي يسجّل عبر /signup، وبعدها
// يُفعَّل حسابه كأدمن يدويًا بسطر SQL واحد (موجود بآخر schema.sql).
// ================================================================

// للاستخدام داخل صفحات app/admin-panel/** (Server Components):
// يُحوّل تلقائيًا لو المستخدم غير مسجّل دخول أو غير أدمن.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin-panel");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/student");

  return { user, profile };
}

// للاستخدام داخل app/api/admin/** (Route Handlers):
// يرجّع null بدل ما يعمل redirect، لأن الـ API لازم يرجّع استجابة JSON.
export async function getAdminUser() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return null;

  return user;
}
