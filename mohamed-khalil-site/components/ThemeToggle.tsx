"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// زر تبديل الوضع الليلي/الفاتح
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // نتجنب اختلاف الرندر بين السيرفر والعميل (hydration mismatch)
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-10 w-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="تبديل الوضع الليلي والفاتح"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 dark:border-navy-600 text-navy-700 dark:text-navy-100 transition-colors hover:border-orange-500 hover:text-orange-500"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
