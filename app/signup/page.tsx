"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Atom, Loader2 } from "lucide-react";

export default function SignupPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, phone: form.phone },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message === "User already registered" ? "هذا البريد مسجّل مسبقًا" : "حدث خطأ، حاول مرة أخرى");
      return;
    }

    // لو مفعّل تأكيد البريد بإعدادات Supabase، يحتاج الطالب يفتح الإيميل أولًا
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5 text-center text-white">
        <div className="max-w-sm">
          <h1 className="mb-3 font-display text-xl font-bold">تحقق من بريدك الإلكتروني 📩</h1>
          <p className="text-sm text-navy-300">
            أرسلنا رابط تفعيل لحسابك. افتح بريدك واضغط الرابط لتسجيل الدخول.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-900 p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white">
            <Atom size={20} />
          </span>
          <h1 className="font-display text-xl font-bold text-white">إنشاء حساب طالب</h1>
          <p className="mt-1 text-sm text-navy-400">سجّل عشان تبدأ فترتك المجانية</p>
        </div>

        <div className="space-y-4">
          <input
            required
            placeholder="الاسم الكامل"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-navy-700 bg-navy-800 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
          />
          <input
            required
            type="tel"
            placeholder="رقم الجوال"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-navy-700 bg-navy-800 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
          />
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
            minLength={6}
            placeholder="كلمة المرور (٦ أحرف فأكثر)"
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
          {loading ? <Loader2 size={18} className="animate-spin" /> : "إنشاء الحساب"}
        </button>

        <p className="mt-5 text-center text-sm text-navy-400">
          عندك حساب؟{" "}
          <Link href="/login" className="font-bold text-orange-500">
            سجّل دخولك
          </Link>
        </p>
      </form>
    </div>
  );
}
