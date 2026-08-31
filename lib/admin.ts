import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// طريقتان يصير فيهم الحساب "أدمن":
// 1) بريده يطابق ADMIN_EMAIL بمتغيرات البيئة - أسهل طريقة، بدون لمس قاعدة البيانات.
// 2) عمود profiles.is_admin = true - يدويًا من Supabase، لإضافة أدمن إضافي لاحقًا.
function isAdminEmail(email: string | undefined | null) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  return !!adminEmail && !!email && email.toLowerCase() === adminEmail;
}

// يُستخدم داخل صفحات السيرفر (Server Components) بمنطقة الأدمن.
// يتأكد إن الزائر مسجّل دخول وإن حسابه أدمن، وإلا يرجّعه لمكان مناسب.
export async function requireAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/admin-panel");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin || isAdminEmail(user.email);
  if (!isAdmin) redirect("/student");

  return { user, profile };
}

// نفس الفكرة بس لمسارات الـ API (route handlers) - يرجّع null لو مو أدمن
// بدل ما يعمل redirect (اللي ما ينفع داخل route handler).
export async function requireAdminApi() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin || isAdminEmail(user.email);
  if (!isAdmin) return null;

  return user;
}
