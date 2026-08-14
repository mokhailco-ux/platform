import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MoyasarCheckout from "@/components/MoyasarCheckout";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: { courseId: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?redirectTo=/checkout/${params.courseId}`);

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, price")
    .eq("id", params.courseId)
    .single();

  if (!course) notFound();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-5 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl border border-navy-800 bg-navy-900 p-8">
        <h1 className="mb-1 font-display text-xl font-bold">إتمام الدفع</h1>
        <p className="mb-6 text-sm text-navy-400">{course.title}</p>
        <div className="mb-6 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-extrabold">{course.price}</span>
          <span className="text-navy-400">ر.س</span>
        </div>

        <MoyasarCheckout courseId={course.id} userId={user.id} amount={course.price} description={course.title} />

        <p className="mt-5 text-center text-xs text-navy-500">
          الدفع آمن ومشفّر بالكامل عبر مويسر، ندعم مدى وApple Pay والبطاقات الائتمانية.
        </p>
      </div>
    </div>
  );
}
