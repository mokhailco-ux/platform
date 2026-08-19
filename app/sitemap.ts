import type { MetadataRoute } from "next";
import { countryList } from "@/lib/countries";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.phykhalil.shop";
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...countryList.map((c) => ({
      url: `${base}/${c.code}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
