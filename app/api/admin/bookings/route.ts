import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  const adminUser = await getAdminUser();
  if (!adminUser) return NextResponse.json({ error: "غير مصرح لك بهذا الإجراء" }, { status: 403 });

  const { id, status, admin_note } = await request.json();
  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: booking, error: fetchError } = await db
    .from("bookings")
    .select("id, slot_id, status")
    .eq("id", id)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "لم يتم العثور على طلب الحجز" }, { status: 404 });
  }

  const wasAlreadyApproved = booking.status === "approved";

  const { error } = await db
    .from("bookings")
    .update({
      status,
      admin_note: admin_note || null,
      decided_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // عند الموافقة الأولى على حجز (لم يكن معتمدًا من قبل)، نزيد عدّاد المقاعد المحجوزة بالموعد
  if (status === "approved" && !wasAlreadyApproved) {
    const { data: slot } = await db
      .from("session_slots")
      .select("booked_count")
      .eq("id", booking.slot_id)
      .single();

    if (slot) {
      await db
        .from("session_slots")
        .update({ booked_count: slot.booked_count + 1 })
        .eq("id", booking.slot_id);
    }
  }

  return NextResponse.json({ ok: true });
}
