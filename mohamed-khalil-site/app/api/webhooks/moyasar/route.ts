import { NextResponse } from "next/server";
import { activatePaidEnrollment } from "@/lib/payments";

// مويسر يرسل طلب POST لهذا الرابط تلقائيًا عند تغيّر حالة أي عملية دفع.
// هذا هو مسار احتياطي: حتى لو أغلق الطالب المتصفح قبل أن يعود من صفحة
// الدفع، يصل هذا الإشعار بشكل مستقل ويفعّل اشتراكه.
// أضف رابط هذا المسار داخل Moyasar Dashboard → Settings → Webhooks
// واستخدم نفس القيمة الموجودة بـ MOYASAR_WEBHOOK_SECRET كـ "Shared Secret".
export async function POST(request: Request) {
  const body = await request.json();

  // تحقق من أن الطلب فعلاً صادر من مويسر عبر مقارنة النص السري
  if (body.secret_token !== process.env.MOYASAR_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "توقيع غير صالح" }, { status: 401 });
  }

  const payment = body.data;
  const courseId = payment?.metadata?.course_id;
  const userId = payment?.metadata?.user_id;

  if (body.type === "payment_paid" && courseId && userId) {
    await activatePaidEnrollment({
      userId,
      courseId,
      amount: payment.amount / 100,
      providerPaymentId: payment.id,
    });
  }

  return NextResponse.json({ ok: true });
}
