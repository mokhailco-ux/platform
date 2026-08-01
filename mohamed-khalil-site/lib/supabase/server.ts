import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// عميل Supabase يُستخدم داخل Server Components وRoute Handlers.
// يقرأ جلسة تسجيل الدخول من الكوكيز حتى نعرف "من هو الطالب" في كل طلب.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // يحدث هذا الخطأ عند الاستدعاء من Server Component وليس Route Handler، ويمكن تجاهله
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // نفس الملاحظة أعلاه
          }
        },
      },
    }
  );
}

// عميل بصلاحيات كاملة (Service Role) يُستخدم فقط داخل السيرفر لعمليات حساسة
// مثل جلب روابط الفيديوهات المحمية بعد التحقق من التسجيل، أو تفعيل الاشتراك بعد الدفع.
// لا تستورد هذا الملف أبدًا داخل مكوّن عميل ("use client").
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
