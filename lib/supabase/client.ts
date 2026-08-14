import { createBrowserClient } from "@supabase/ssr";

// عميل Supabase يُستخدم داخل مكونات العميل ("use client") مثل نماذج تسجيل الدخول
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
