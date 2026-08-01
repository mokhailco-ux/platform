"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Moyasar: { init: (config: Record<string, unknown>) => void };
  }
}

// نموذج دفع مويسر الجاهز (يدعم مدى، Apple Pay، والبطاقات الائتمانية).
// بيانات البطاقة لا تمر عبر سيرفرنا إطلاقًا - كل شيء يحدث داخل نموذج مويسر
// المستضاف، وهذا يبقينا خارج نطاق متطلبات PCI-DSS المعقدة.
export default function MoyasarCheckout({
  courseId,
  userId,
  amount,
  description,
}: {
  courseId: string;
  userId: string;
  amount: number;
  description: string;
}) {
  useEffect(() => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    function init() {
      if (!window.Moyasar) return;
      window.Moyasar.init({
        element: ".mysr-form",
        amount: Math.round(amount * 100), // مويسر يتعامل بالهللات (أصغر وحدة عملة)
        currency: "SAR",
        description,
        publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
        // نمرّر معرّف الدورة والطالب داخل رابط العودة نفسه، حتى لا نعتمد فقط
        // على حقل metadata غير المضمون الوصول بكل الحالات.
        callback_url: `${siteUrl}/api/payments/callback?course_id=${courseId}&user_id=${userId}`,
        metadata: { course_id: courseId, user_id: userId },
        supported_networks: ["visa", "mastercard", "mada"],
        methods: ["creditcard", "applepay"],
      });
    }

    // لو السكربت محمّل مسبقًا (تنقّل بين الصفحات)، بادر بالتهيئة مباشرة
    if (window.Moyasar) init();
    const timer = setTimeout(init, 800);
    return () => clearTimeout(timer);
  }, [courseId, userId, amount, description]);

  return (
    <>
      <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.15.0/moyasar.css" />
      <Script src="https://cdn.moyasar.com/mpf/1.15.0/moyasar.js" strategy="afterInteractive" />
      <div className="mysr-form" />
    </>
  );
}
