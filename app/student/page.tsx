import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogOut, Atom, Clock, Lock, PlayCircle, CalendarDays, ShieldCheck } from "lucide-react";
import TrialButtonClient from "@/components/TrialButtonClient";

export const dynamic = "force-dynamic";

type EnrollmentRow = {
  course_id: string;
  status: "trial" | "active" | "expired";
  trial_ends_at: string | null;
};

export default async function StudentDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, is_admin")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.is_admin || (process.env.ADMIN_EMAIL?.toLowerCase() === user.email?.toLowerCase());

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, subject, stage, price")
    .order("created_at", { ascending: true });

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("course_id, status, trial_ends_at")
    .eq("user_id", user.id);

  const enrollmentByCourse = new Map<string, EnrollmentRow>(
    (enrollments ?? []).map((e) => [e.course_id, e as EnrollmentRow])
  );

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <header className="flex items-center justify-between border-b border-navy-100 bg-white px-6 py-5 dark:border-navy-800 dark:bg-navy-900">
        <div className="flex items-center gap-2 font-display font-extrabold text-navy-900 dark:text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
            <Atom size={16} />
          </span>
          مرحبًا {profile?.full_name?.split(" ")[0] ?? "بك"} 👋
        </div>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link href="/admin-panel" className="flex items-center gap-2 text-sm font-bold text-orange-500">
              <ShieldCheck size={16} /> لوحة الإدارة
            </Link>
          )}
          <Link href="/student/booking" className="flex items-center gap-2 text-sm font-bold text-navy-500 hover:text-orange-500 dark:text-navy-300">
            <CalendarDays size={16} /> حجز حصة
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button className="flex items-center gap-2 text-sm font-bold text-navy-500 hover:text-red-500 dark:text-navy-300">
              <LogOut size={16} /> تسجيل خروج
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="mb-6 font-display text-xl font-bold text-navy-900 dark:text-white">دوراتي</h1>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {(courses ?? []).map((course) => {
            const enrollment = enrollmentByCourse.get(course.id);
            const trialActive =
              enrollment?.status === "trial" &&
              enrollment.trial_ends_at &&
              new Date(enrollment.trial_ends_at) > new Date();
            const hasAccess = enrollment?.status === "active" || trialActive;

            let daysLeft = 0;
            if (trialActive && enrollment?.trial_ends_at) {
              daysLeft = Math.ceil(
                (new Date(enrollment.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
            }

            return (
              <div key={course.id} className="card p-6">
                <span className="w-fit rounded-full bg-electric-500/10 px-3 py-1 text-xs font-bold text-electric-500">
                  {course.subject} • {course.stage}
                </span>
                <h3 className="mt-3 font-bold text-navy-900 dark:text-white">{course.title}</h3>

                {hasAccess ? (
                  <>
                    {trialActive && (
                      <p className="mt-2 flex items-center gap-1 text-xs text-orange-500">
                        <Clock size={13} /> باقي {daysLeft} يوم على انتهاء التجربة المجانية
                      </p>
                    )}
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="btn-primary mt-5 w-full justify-center !py-2.5 text-sm"
                    >
                      <PlayCircle size={16} /> شاهد الفيديوهات
                    </Link>
                  </>
                ) : enrollment?.status === "trial" ? (
                  <>
                    <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                      <Lock size={13} /> انتهت الفترة المجانية
                    </p>
                    <Link
                      href={`/checkout/${course.id}`}
                      className="btn-primary mt-5 w-full justify-center !py-2.5 text-sm"
                    >
                      ادفع {course.price} ر.س لمواصلة الدورة
                    </Link>
                  </>
                ) : (
                  <TrialButton courseId={course.id} price={course.price} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// زر بدء التجربة المجانية - مكوّن عميل بسيط منفصل لأنه يحتاج تفاعل
function TrialButton({ courseId, price }: { courseId: string; price: number }) {
  return (
    <div className="mt-5 flex flex-col gap-2">
      <TrialButtonClient courseId={courseId} />
      <Link href={`/checkout/${courseId}`} className="btn-secondary w-full justify-center !py-2.5 text-sm">
        أو ادفع الآن مباشرة ({price} ر.س)
      </Link>
    </div>
  );
}
