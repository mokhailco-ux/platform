"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Atom, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);
    if (error) {
      setError("البريد أو كلمة المرور غير صحيحة");
      return;
    }

    const redirectTo = searchParams.get("redirectTo") || "/student";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-900 p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
            <Atom size={20} />
          </span>
          <h1 className="font-display text-xl font-bold text-white">تسجيل الدخول</h1>
          <p className="mt-1 text-sm text-navy-400">ادخل لمتابعة دوراتك</p>
        </div>

        <div className="space-y-4">
          <input
            required
            type="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-navy-700 bg-navy-800 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
          />
          <input
            required
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-navy-700 bg-navy-800 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-6 w-full justify-center disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "دخول"}
        </button>

        <p className="mt-5 text-center text-sm text-navy-400">
          ليس لديك حساب؟{" "}
          <Link href="/signup" className="font-bold text-orange-500">
            أنشئ حسابًا
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
