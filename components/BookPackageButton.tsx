"use client";

import { useState } from "react";
import { CalendarCheck, Send } from "lucide-react";

// عند الضغط على "احجز"، يفتح حقل بسيط لكتابة الاسم، وبعد التأكيد
// يفتح واتساب برسالة جاهزة فيها اسم الطالب واسم الباقة اللي اختارها -
// بدون أي حاجة لتسجيل حساب أو قاعدة بيانات.
export default function BookPackageButton({
  packageTitle,
  whatsapp,
}: {
  packageTitle: string;
  whatsapp: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function confirmBooking() {
    if (!name.trim()) return;
    const message = `مرحبًا، أنا ${name.trim()}، أرغب بحجز باقة: ${packageTitle}`;
    const url = `${whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
    setName("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-primary mt-6 w-full justify-center !py-3 text-sm"
      >
        <CalendarCheck size={16} /> احجز الآن
      </button>
    );
  }

  return (
    <div className="mt-6 space-y-2">
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && confirmBooking()}
        placeholder="اكتب اسمك للتأكيد"
        className="input-field text-sm"
      />
      <button
        onClick={confirmBooking}
        disabled={!name.trim()}
        className="btn-primary w-full justify-center !py-3 text-sm disabled:opacity-50"
      >
        <Send size={16} /> تأكيد الحجز عبر واتساب
      </button>
    </div>
  );
}
