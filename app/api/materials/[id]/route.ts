import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// يتحقق أولًا من أن الطالب مسجّل ولديه اشتراك فعّال بالدورة المرتبطة
// بهذا الملف، قبل ما يولّد رابط تحميل مؤقت (صالح لدقيقة واحدة فقط).
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.redirect(new URL("/login", request.url));

  const admin = createAdminClient();
  const { data: material } = await admin
    .from("course_materials")
    .select("id, file_path, course_id")
    .eq("id", id)
    .single();

  if (!material) return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("status, trial_ends_at")
    .eq("user_id", user.id)
    .eq("course_id", material.course_id)
    .maybeSingle();

  const trialActive =
    enrollment?.status === "trial" &&
    enrollment.trial_ends_at &&
    new Date(enrollment.trial_ends_at) > new Date();
  const hasAccess = enrollment?.status === "active" || trialActive;

  if (!hasAccess) {
    return NextResponse.json({ error: "لا تملك صلاحية الوصول لهذا الملف" }, { status: 403 });
  }

  const { data: signed, error } = await admin.storage
    .from("course-materials")
    .createSignedUrl(material.file_path, 60);

  if (error || !signed) {
    return NextResponse.json({ error: "تعذّر إنشاء رابط التحميل" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
