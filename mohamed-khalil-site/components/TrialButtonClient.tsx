"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";

export default function TrialButtonClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function startTrial() {
    setLoading(true);
    const res = await fetch("/api/enroll/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    setLoading(false);
    if (res.ok) router.refresh();
  }

  return (
    <button onClick={startTrial} disabled={loading} className="btn-primary w-full justify-center !py-2.5 text-sm disabled:opacity-60">
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
      ابدأ الفترة المجانية
    </button>
  );
}
