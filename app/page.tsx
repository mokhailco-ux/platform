import HomePage from "@/components/HomePage";
import { countries } from "@/lib/countries";

// الصفحة الرئيسية الافتراضية (بدون تحديد دولة بالرابط) تعرض محتوى
// السعودية كدولة أساسية. لعرض دولة أخرى مباشرة استخدم /jo.
export default function Home() {
  return <HomePage country={countries.sa} />;
}
