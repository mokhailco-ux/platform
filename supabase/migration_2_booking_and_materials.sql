
-- ================================================================
-- تحديث: ملفات PDF لكل دورة + نظام حجز الحصص
-- نفّذ هذا الجزء بعد الجزء الأول (SQL Editor → New query → الصق وشغّل)
-- ================================================================

-- ---------- 6) ملفات PDF لكل دورة (حلول اختبارات، ملازم...) ----------
create table if not exists course_materials (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  file_path text not null,   -- مسار الملف داخل تخزين Supabase (يُعبّى تلقائيًا عند الرفع من لوحة الأدمن)
  order_index int default 0,
  created_at timestamptz default now()
);

alter table course_materials enable row level security;
-- نفس مبدأ الفيديوهات: لا وصول مباشر، فقط عبر السيرفر بعد التحقق من التسجيل
create policy "لا وصول مباشر - فقط عبر السيرفر" on course_materials for select using (false);

-- حاوية تخزين خاصة (مو عامة) لملفات الـ PDF
insert into storage.buckets (id, name, public)
values ('course-materials', 'course-materials', false)
on conflict (id) do nothing;

-- ---------- 7) مواعيد الحصص المتاحة (يضيفها الأدمن) ----------
create table if not exists session_slots (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null default 'group', -- private | group | consultation
  course_id uuid references courses(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  capacity int not null default 1,
  created_at timestamptz default now()
);

alter table session_slots enable row level security;
create policy "أي طالب مسجّل دخول يشوف المواعيد المتاحة"
  on session_slots for select using (auth.uid() is not null);

-- ---------- 8) طلبات حجز الحصص ----------
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  slot_id uuid references session_slots(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending', -- pending | confirmed | rejected | cancelled
  note text,
  created_at timestamptz default now()
);

alter table bookings enable row level security;
create policy "الطالب يشوف حجوزاته فقط"
  on bookings for select using (auth.uid() = user_id);
create policy "الطالب يقدر يحجز لنفسه فقط"
  on bookings for insert with check (auth.uid() = user_id);

-- ---------- 9) تفعيلك كأدمن (نفّذ هذا السطر بعد ما تنشئ حسابك من /signup) ----------
-- استبدل البريد بالبريد اللي سجّلت فيه، ثم شغّل هذا السطر لوحده:
-- update profiles set is_admin = true
--   where id = (select id from auth.users where email = 'ضع-بريدك-هنا@example.com');
