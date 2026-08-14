import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// نفس منطق حماية الفيديوهات بالضبط: نتحقق من الاشتراك الفعلي (تجربة سارية
// أو اشتراك مفعّل) بالسيرفر أولًا، ولا نُنشئ رابط تحميل إلا بعد التأكد.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });

  const admin = createAdminClient();

  const { data: material } = await admin
    .from("course_materials")
    .select("id, course_id, file_path, type")
    .eq("id", params.id)
    .single();

  if (!material || material.type !== "pdf" || !material.file_path) {
    return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  }

  const { data: enrollment } = await admin
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
    .createSignedUrl(material.file_path, 60); // رابط صالح لمدة دقيقة واحدة فقط

  if (error || !signed) {
    return NextResponse.json({ error: "تعذّر إنشاء رابط التحميل" }, { status: 500 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
