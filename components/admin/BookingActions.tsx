"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

export default function BookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"confirmed" | "rejected" | null>(null);

  async function act(status: "confirmed" | "rejected") {
    setLoading(status);
    const res = await fetch("/api/admin/bookings/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => act("confirmed")}
        disabled={loading !== null}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-500 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading === "confirmed" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} موافقة
      </button>
      <button
        onClick={() => act("rejected")}
        disabled={loading !== null}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500 py-2.5 text-sm font-bold text-white disabled:opacity-60"
      >
        {loading === "rejected" ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} رفض
      </button>
    </div>
  );
}
