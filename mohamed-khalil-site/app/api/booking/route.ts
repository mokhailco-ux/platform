import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });

  const { slot_id, student_note } = await request.json();
  if (!slot_id) return NextResponse.json({ error: "الرجاء اختيار موعد" }, { status: 400 });

  const admin = createAdminClient();

  const { data: slot } = await admin
    .from("session_slots")
    .select("id, type, capacity, booked_count, is_active")
    .eq("id", slot_id)
    .single();

  if (!slot || !slot.is_active) {
    return NextResponse.json({ error: "هذا الموعد لم يعد متاحًا" }, { status: 404 });
  }

  if (slot.booked_count >= slot.capacity) {
    return NextResponse.json({ error: "اكتملت مقاعد هذا الموعد" }, { status: 409 });
  }

  const { data: existing } = await admin
    .from("bookings")
    .select("id")
    .eq("user_id", user.id)
    .eq("slot_id", slot_id)
    .in("status", ["pending", "approved"])
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "لديك طلب حجز على هذا الموعد بالفعل" }, { status: 409 });
  }

  const { error } = await admin.from("bookings").insert({
    user_id: user.id,
    slot_id,
    type: slot.type,
    student_note: student_note || null,
    status: "pending",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
