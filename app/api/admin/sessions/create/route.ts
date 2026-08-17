import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 403 });

  const { title, type, courseId, startTime, endTime, capacity } = await request.json();
  if (!title || !type || !startTime || !endTime) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("session_slots").insert({
    title,
    type, // private | group | consultation
    course_id: courseId || null,
    start_time: startTime,
    end_time: endTime,
    capacity: capacity || 1,
  });

  if (error) return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
