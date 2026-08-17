import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 403 });

  const { courseId, title, description, youtubeId } = await request.json();
  if (!courseId || !title || !youtubeId) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("course_videos").insert({
    course_id: courseId,
    title,
    description: description || null,
    youtube_id: youtubeId,
  });

  if (error) return NextResponse.json({ error: "فشل الحفظ" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
