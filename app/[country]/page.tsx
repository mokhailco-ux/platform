import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { countries, countryList, getCountry } from "@/lib/countries";

// نولّد رابطًا ثابتًا لكل دولة مسبقًا لأداء أفضل وفهرسة أسرع بمحركات البحث
export function generateStaticParams() {
  return countryList.map((c) => ({ country: c.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country: countryCode } = await params;
  const country = getCountry(countryCode);
  if (!country) return {};

  return {
    title: `محمد خليل | مدرس فيزياء ورياضيات أونلاين - ${country.name}`,
    description: `دروس أونلاين في الفيزياء والرياضيات لطلاب ${country.name} مع الأستاذ محمد خليل. دورات لكل المراحل بأسعار تناسبك.`,
    alternates: {
      canonical: `/${country.code}`,
      languages: Object.fromEntries(countryList.map((c) => [c.code, `/${c.code}`])),
    },
  };
}

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country: countryCode } = await params;
  const country = countries[countryCode];
  if (!country) notFound();

  return <HomePage country={country} />;
}
