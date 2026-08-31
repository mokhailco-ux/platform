import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// يُستدعى عند ضغط الطالب على "ابدأ الفترة المجانية" في صفحة دورة معيّنة.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولًا" }, { status: 401 });
  }

  const { courseId } = await request.json();
  if (!courseId) {
    return NextResponse.json({ error: "الدورة غير محددة" }, { status: 400 });
  }

  const { data: course } = await supabase
    .from("courses")
    .select("trial_days")
    .eq("id", courseId)
    .single();

  if (!course) {
    return NextResponse.json({ error: "الدورة غير موجودة" }, { status: 404 });
  }

  // لا نسمح بإعادة تفعيل تجربة مجانية لمن استخدمها من قبل أو لديه اشتراك فعّال
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "لديك تسجيل سابق بهذه الدورة" }, { status: 400 });
  }

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + (course.trial_days ?? 3));

  const { error } = await supabase.from("enrollments").insert({
    user_id: user.id,
    course_id: courseId,
    status: "trial",
    trial_ends_at: trialEndsAt.toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: "تعذّر بدء التجربة المجانية" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
