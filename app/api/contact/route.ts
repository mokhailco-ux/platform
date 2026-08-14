import { NextResponse } from "next/server";

// نقطة استقبال نموذج التواصل.
// حاليًا يتم تسجيل الرسالة في السيرفر فقط. لربطها بالبريد الإلكتروني
// أو واتساب بيزنس API، يمكنك إضافة تكامل مع خدمة مثل Resend أو Twilio هنا.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, message } = body as {
      name?: string;
      phone?: string;
      message?: string;
    };

    if (!name || !phone || !message) {
      return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
    }

    // TODO: أرسل الرسالة عبر بريد إلكتروني أو خزّنها في قاعدة بيانات
    console.log("رسالة تواصل جديدة:", { name, phone, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });
  }
}
