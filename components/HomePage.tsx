import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Courses from "@/components/Courses";
import Videos from "@/components/Videos";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import WhatsAppButton from "@/components/WhatsAppButton";
import type { Country } from "@/lib/countries";

// القالب المشترك للصفحة الرئيسية - يُستخدم مرة للرابط الافتراضي "/"
// ومرة أخرى لكل رابط دولة (/sa, /jo, /ae) بنفس المكونات بالضبط
// لكن ببيانات (أسعار، واتساب، مناهج، أسئلة شائعة) مختلفة حسب الدولة الممرَّرة.
export default function HomePage({ country }: { country: Country }) {
  return (
    <>
      <Header country={country} />
      <main>
        <Hero country={country} />
        <Stats />
        <About country={country} />
        <Courses country={country} />
        <Videos />
        <Testimonials />
        <FAQ country={country} />
        <Contact country={country} />
      </main>
      <Footer country={country} />
      <ScrollToTop />
      <WhatsAppButton country={country} />
    </>
  );
}
