"use client";

import { useEffect, useState } from "react";
import { Menu, X, Atom, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { countryList, type Country } from "@/lib/countries";

const links = [
  { href: "#about", label: "نبذة عني" },
  { href: "#courses", label: "الدورات" },
  { href: "#videos", label: "الفيديوهات" },
  { href: "#testimonials", label: "آراء الطلاب" },
  { href: "#faq", label: "الأسئلة الشائعة" },
  { href: "#contact", label: "تواصل معي" },
];

// قائمة منسدلة لاختيار الدولة - كل دولة رابطها المستقل /sa /jo /om /ae
function CountrySelector({ current }: { current: Country }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-full border border-navy-200 px-3 py-2 text-sm font-bold text-navy-700 dark:border-navy-600 dark:text-navy-100"
        aria-label="اختر دولتك"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.name}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          {/* طبقة شفافة لإغلاق القائمة عند الضغط خارجها */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-navy-100 bg-white shadow-lg dark:border-navy-700 dark:bg-navy-900">
            {countryList.map((c) => (
              <a
                key={c.code}
                href={`/${c.code}`}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-navy-50 dark:hover:bg-navy-800 ${
                  c.code === current.code ? "text-orange-500" : "text-navy-700 dark:text-navy-200"
                }`}
              >
                <span>{c.flag}</span> {c.name}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// الهيدر الثابت أعلى الصفحة، يتحول لخلفية زجاجية عند التمرير
export default function Header({ country }: { country: Country }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-navy-950/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-16">
        <a href="#" className="flex items-center gap-2 font-display font-extrabold text-navy-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 ring-2 ring-white/20">
            <Atom size={18} />
          </span>
          <span className="text-lg">أ. محمد خليل</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-600 transition-colors hover:text-orange-500 dark:text-navy-200 dark:hover:text-orange-400"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <CountrySelector current={country} />
          <ThemeToggle />
          <a href="/student" className="hidden text-sm font-bold text-navy-600 hover:text-orange-500 dark:text-navy-200 sm:inline-block">
            منصة الطلاب
          </a>
          <a href="#courses" className="btn-primary hidden !px-5 !py-2.5 text-sm sm:inline-flex">
            احجز الآن
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 dark:border-navy-600 lg:hidden"
            aria-label="فتح القائمة"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* قائمة الجوال */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-navy-100 bg-white px-5 py-4 dark:border-navy-800 dark:bg-navy-950 lg:hidden">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-navy-700 hover:bg-navy-50 dark:text-navy-200 dark:hover:bg-navy-800"
            >
              {link.label}
            </a>
          ))}
          <a href="#courses" onClick={() => setOpen(false)} className="btn-primary mt-2 justify-center">
            احجز الآن
          </a>
        </nav>
      )}
    </header>
  );
}
