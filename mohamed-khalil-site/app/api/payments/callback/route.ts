import { NextResponse } from "next/server";
import { activatePaidEnrollment } from "@/lib/payments";

// Moyasar يعيد توجيه الطالب لهذا الرابط بعد محاولة الدفع، مع معرّف العملية.
// لا نثق بالحالة الموجودة برابط التوجيه وحدها - نتحقق من مويسر مباشرة بمفتاحنا السري
// لمنع أي محاولة تلاعب بمعاملات الرابط.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const paymentId = searchParams.get("id");
  // نقرأ المعرّفات من رابط العودة نفسه أولًا (أضفناها عند إنشاء نموذج الدفع)
  const courseIdFromUrl = searchParams.get("course_id");
  const userIdFromUrl = searchParams.get("user_id");

  if (!paymentId) {
    return NextResponse.redirect(`${origin}/student?payment=missing`);
  }

  const res = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: "Basic " + Buffer.from(`${process.env.MOYASAR_SECRET_KEY}:`).toString("base64"),
    },
  });

  if (!res.ok) {
    return NextResponse.redirect(`${origin}/student?payment=error`);
  }

  const payment = await res.json();
  const courseId = courseIdFromUrl || payment.metadata?.course_id;
  const userId = userIdFromUrl || payment.metadata?.user_id;

  if (payment.status === "paid" && courseId && userId) {
    await activatePaidEnrollment({
      userId,
      courseId,
      amount: payment.amount / 100, // مويسر يرسل المبلغ بالهللات
      providerPaymentId: payment.id,
    });
    return NextResponse.redirect(`${origin}/student/courses/${courseId}?payment=success`);
  }

  return NextResponse.redirect(`${origin}/student?payment=failed`);
}
