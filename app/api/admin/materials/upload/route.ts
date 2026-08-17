import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (!admin) return NextResponse.json({ error: "غير مصرّح" }, { status: 403 });

  const formData = await request.formData();
  const courseId = formData.get("courseId") as string;
  const title = formData.get("title") as string;
  const file = formData.get("file") as File | null;

  if (!courseId || !title || !file) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "الملف لازم يكون PDF فقط" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${courseId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("course-materials")
    .upload(path, await file.arrayBuffer(), { contentType: "application/pdf" });

  if (uploadError) {
    return NextResponse.json({ error: "فشل رفع الملف" }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("course_materials").insert({
    course_id: courseId,
    title,
    file_path: path,
  });

  if (insertError) {
    return NextResponse.json({ error: "فشل حفظ بيانات الملف" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
