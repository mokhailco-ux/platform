import { MessageCircle } from "lucide-react";
import type { Country } from "@/lib/countries";

// زر واتساب عائم ثابت لتسهيل التواصل الفوري من أي مكان بالموقع
export default function WhatsAppButton({ country }: { country: Country }) {
  return (
    <a
      href={country.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 transition-transform hover:scale-110"
    >
      <MessageCircle size={26} fill="white" />
    </a>
  );
}
