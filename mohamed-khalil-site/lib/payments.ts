import { createAdminClient } from "@/lib/supabase/server";

// يُستدعى هذا بعد التأكد الفعلي من نجاح الدفع عبر Moyasar (سواء من صفحة
// التأكيد بعد التحويل، أو من الـ Webhook - أيهما وصل أولًا).
// مصمّم ليكون "متكررًا الاستدعاء بأمان" (Idempotent): تكراره لنفس الدفعة لا يضر.
export async function activatePaidEnrollment({
  userId,
  courseId,
  amount,
  providerPaymentId,
}: {
  userId: string;
  courseId: string;
  amount: number;
  providerPaymentId: string;
}) {
  const supabase = createAdminClient();

  // سجّل عملية الدفع إن لم تكن مسجّلة (upsert بمعرّف الدفعة من مويسر)
  await supabase.from("payments").upsert(
    {
      user_id: userId,
      course_id: courseId,
      amount,
      provider: "moyasar",
      provider_payment_id: providerPaymentId,
      status: "paid",
    },
    { onConflict: "provider_payment_id" }
  );

  // فعّل تسجيل الطالب بالدورة (أو حدّثه من trial إلى active)
  await supabase.from("enrollments").upsert(
    {
      user_id: userId,
      course_id: courseId,
      status: "active",
      activated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,course_id" }
  );
}
