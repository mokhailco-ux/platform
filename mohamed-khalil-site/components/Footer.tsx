import { Atom, MessageCircle, Send as TelegramIcon, Facebook, Instagram } from "lucide-react";
import { social } from "@/lib/data";
import type { Country } from "@/lib/countries";

export default function Footer({ country }: { country: Country }) {
  const socialLinks = [
    { icon: MessageCircle, href: country.whatsapp, label: "واتساب" },
    { icon: TelegramIcon, href: social.telegram, label: "تيليجرام" },
    { icon: Facebook, href: social.facebook, label: "فيسبوك" },
    { icon: Instagram, href: social.instagram, label: "إنستغرام" },
  ];

  return (
    <footer className="border-t border-navy-800 bg-navy-950 px-5 py-12 text-navy-300 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <a href="#" className="flex items-center gap-2 font-display font-extrabold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
            <Atom size={18} />
          </span>
          أ. محمد خليل
        </a>

        <p className="max-w-md text-sm leading-6 text-navy-400">
          مدرس فيزياء ورياضيات أونلاين لطلاب الثانوية العامة في {country.name}.
        </p>

        <div className="flex items-center gap-3">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-700 transition-colors hover:border-orange-500 hover:text-orange-500"
            >
              <s.icon size={16} />
            </a>
          ))}
        </div>

        <div className="h-px w-full max-w-md bg-navy-800" />

        <p className="text-xs text-navy-500">
          جميع الحقوق محفوظة © {new Date().getFullYear()} محمد خليل
        </p>
      </div>
    </footer>
  );
}
