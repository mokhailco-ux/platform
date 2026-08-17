"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarCheck, Loader2 } from "lucide-react";

export default function BookingRequestButton({ slotId }: { slotId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function request() {
    setLoading(true);
    const res = await fetch("/api/bookings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <button
      onClick={request}
      disabled={loading}
      className="btn-primary mt-4 w-full justify-center !py-2.5 text-sm disabled:opacity-60"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <CalendarCheck size={16} />}
      اطلب حجز هذا الموعد
    </button>
  );
}
