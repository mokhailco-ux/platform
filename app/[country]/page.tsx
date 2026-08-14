import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePage from "@/components/HomePage";
import { countries, countryList, getCountry } from "@/lib/countries";

// نولّد رابطًا ثابتًا لكل دولة مسبقًا لأداء أفضل وفهرسة أسرع بمحركات البحث
export function generateStaticParams() {
  return countryList.map((c) => ({ country: c.code }));
}

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const country = getCountry(params.country);
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

export default function CountryPage({ params }: { params: { country: string } }) {
  const country = countries[params.country];
  if (!country) notFound();

  return <HomePage country={country} />;
}
