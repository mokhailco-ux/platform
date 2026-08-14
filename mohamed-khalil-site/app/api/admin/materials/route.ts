import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const adminUser = await getAdminUser();
  if (!adminUser) return NextResponse.json({ error: "غير مصرح لك بهذا الإجراء" }, { status: 403 });

  const formData = await request.formData();
  const courseId = String(formData.get("course_id") || "");
  const title = String(formData.get("title") || "");
  const type = String(formData.get("type") || "pdf");

  if (!courseId || !title) {
    return NextResponse.json({ error: "الرجاء اختيار الدورة وكتابة العنوان" }, { status: 400 });
  }

  const db = createAdminClient();

  if (type === "video") {
    const youtubeId = String(formData.get("youtube_id") || "").trim();
    if (!youtubeId) {
      return NextResponse.json({ error: "معرّف فيديو يوتيوب مطلوب" }, { status: 400 });
    }

    const { error } = await db.from("course_materials").insert({
      course_id: courseId,
      title,
      type: "video",
      youtube_id: youtubeId,
      file_path: "",
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "الرجاء اختيار ملف PDF" }, { status: 400 });
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "الملف يجب أن يكون بصيغة PDF" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const filePath = `${courseId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await db.storage
    .from("course-materials")
    .upload(filePath, Buffer.from(arrayBuffer), { contentType: "application/pdf" });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { error } = await db.from("course_materials").insert({
    course_id: courseId,
    title,
    type: "pdf",
    file_path: filePath,
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

  const { data: material } = await db
    .from("course_materials")
    .select("file_path, type")
    .eq("id", id)
    .single();

  if (material?.type === "pdf" && material.file_path) {
    await db.storage.from("course-materials").remove([material.file_path]);
  }

  const { error } = await db.from("course_materials").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
