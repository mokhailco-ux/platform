import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Tajawal, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const siteUrl = "https://mohamedkhalil-physics.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "محمد خليل | مدرس فيزياء ورياضيات أونلاين - الثانوية العامة السعودية",
    template: "%s | محمد خليل",
  },
  description:
    "دروس أونلاين في الفيزياء والرياضيات لطلاب الثانوية العامة بالسعودية مع الأستاذ محمد خليل. دورات لجميع المراحل، شرح مبسط، ومتابعة مستمرة لرفع مستوى الطالب.",
  keywords: [
    "مدرس فيزياء أونلاين",
    "مدرس رياضيات السعودية",
    "فيزياء ثالث ثانوي",
    "فيزياء ثاني ثانوي",
    "فيزياء أول ثانوي",
    "دروس خصوصية فيزياء",
    "الثانوية العامة السعودية",
  ],
  authors: [{ name: "محمد خليل" }],
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: siteUrl,
    siteName: "محمد خليل - فيزياء ورياضيات",
    title: "أتقن الفيزياء مع الأستاذ محمد خليل",
    description:
      "دروس أونلاين في الفيزياء والرياضيات لطلاب الثانوية العامة بالسعودية.",
  },
  twitter: {
    card: "summary_large_image",
    title: "أتقن الفيزياء مع الأستاذ محمد خليل",
    description:
      "دروس أونلاين في الفيزياء والرياضيات لطلاب الثانوية العامة بالسعودية.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
};

// بيانات منظمة (Schema.org) لتحسين ظهور الموقع في نتائج البحث
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "محمد خليل",
  jobTitle: "مدرس فيزياء ورياضيات",
  description: "مدرس فيزياء ورياضيات أونلاين لطلاب الثانوية العامة في السعودية",
  areaServed: "SA",
  url: siteUrl,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${tajawal.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
