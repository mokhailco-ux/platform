import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 403 });

  const { bookingId, status } = await request.json();
  if (!bookingId || !["confirmed", "rejected"].includes(status)) {
    return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);

  if (error) return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
