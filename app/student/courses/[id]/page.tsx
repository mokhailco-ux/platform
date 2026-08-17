import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { Lock, ArrowRight, FileText, Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CourseVideosPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, price")
    .eq("id", params.id)
    .single();

  if (!course) notFound();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("status, trial_ends_at")
    .eq("user_id", user.id)
    .eq("course_id", params.id)
    .maybeSingle();

  const trialActive =
    enrollment?.status === "trial" &&
    enrollment.trial_ends_at &&
    new Date(enrollment.trial_ends_at) > new Date();
  const hasAccess = enrollment?.status === "active" || trialActive;

  // نتحقق من الصلاحية هنا في السيرفر أولًا، ولا نجلب روابط الفيديوهات
  // إطلاقًا إن لم يكن الوصول مصرّحًا به - هذا هو خط الحماية الفعلي.
  if (!hasAccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-950 px-5 text-center text-white">
        <Lock size={32} className="text-orange-500" />
        <h1 className="font-display text-xl font-bold">هذه الدورة غير متاحة لك حاليًا</h1>
        <p className="max-w-sm text-sm text-navy-300">
          إمّا أن فترتك المجانية انتهت أو لم تسجّل بهذه الدورة بعد.
        </p>
        <Link href={`/checkout/${course.id}`} className="btn-primary">
          ادفع {course.price} ر.س وتابع الآن
        </Link>
        <Link href="/student" className="text-sm text-navy-400 hover:text-white">
          الرجوع لدوراتي
        </Link>
      </div>
    );
  }

  // استخدام عميل الصلاحيات الكاملة هنا آمن، لأننا تحققنا للتو أعلاه من صلاحية الطالب
  const admin = createAdminClient();
  const { data: videos } = await admin
    .from("course_videos")
    .select("id, title, description, youtube_id")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  const { data: materials } = await admin
    .from("course_materials")
    .select("id, title")
    .eq("course_id", course.id)
    .order("order_index", { ascending: true });

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <Link href="/student" className="flex items-center gap-2 text-sm font-bold text-navy-500 dark:text-navy-300">
          <ArrowRight size={16} /> الرجوع لدوراتي
        </Link>
        <h1 className="mt-2 font-display text-lg font-bold text-navy-900 dark:text-white">{course.title}</h1>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10">
        {(!videos || videos.length === 0) && (
          <p className="text-center text-navy-400">لم تُضَف فيديوهات لهذه الدورة بعد.</p>
        )}

        <div className="space-y-6">
          {(videos ?? []).map((video) => (
            <div key={video.id} className="card overflow-hidden">
              <div className="aspect-video w-full bg-navy-800">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-navy-900 dark:text-white">{video.title}</h3>
                {video.description && (
                  <p className="mt-1 text-sm text-navy-500 dark:text-navy-300">{video.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {materials && materials.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-bold text-navy-800 dark:text-navy-200">ملفات ومرفقات</h2>
            <div className="space-y-2">
              {materials.map((m) => (
                <a
                  key={m.id}
                  href={`/api/materials/${m.id}`}
                  className="card flex items-center justify-between p-4 text-sm transition-colors hover:border-orange-500"
                >
                  <span className="flex items-center gap-2 text-navy-800 dark:text-navy-100">
                    <FileText size={16} className="text-orange-500" /> {m.title}
                  </span>
                  <Download size={16} className="text-navy-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
