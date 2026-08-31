import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });

  const { slotId, note } = await request.json();
  if (!slotId) return NextResponse.json({ error: "الموعد غير محدد" }, { status: 400 });

  // امنع الطالب من إرسال أكثر من طلب حجز لنفس الموعد
  const { data: existing } = await supabase
    .from("bookings")
    .select("id")
    .eq("slot_id", slotId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "لديك طلب حجز سابق لهذا الموعد" }, { status: 400 });
  }

  const { error } = await supabase.from("bookings").insert({
    slot_id: slotId,
    user_id: user.id,
    note: note || null,
    status: "pending",
  });

  if (error) return NextResponse.json({ error: "فشل إرسال طلب الحجز" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
