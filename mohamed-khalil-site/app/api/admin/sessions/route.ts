import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const adminUser = await getAdminUser();
  if (!adminUser) return NextResponse.json({ error: "غير مصرح لك بهذا الإجراء" }, { status: 403 });

  const body = await request.json();
  const { type, title, starts_at, duration_minutes, capacity, notes } = body;

  if (!type || !title || !starts_at) {
    return NextResponse.json({ error: "الرجاء تعبئة كل الحقول المطلوبة" }, { status: 400 });
  }

  const db = createAdminClient();
  const { error } = await db.from("session_slots").insert({
    type,
    title,
    starts_at,
    duration_minutes: duration_minutes && duration_minutes > 0 ? duration_minutes : 60,
    capacity: capacity && capacity > 0 ? capacity : 1,
    notes: notes || null,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const adminUser = await getAdminUser();
  if (!adminUser) return NextResponse.json({ error: "غير مصرح لك بهذا الإجراء" }, { status: 403 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "المعرّف مطلوب" }, { status: 400 });

  const db = createAdminClient();
  const { error } = await db.from("session_slots").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
