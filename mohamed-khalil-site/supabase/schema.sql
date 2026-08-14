-- ============================================================
-- قاعدة بيانات منصة محمد خليل التعليمية
-- نفّذ هذا الملف كامل مرة واحدة من: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ---------- 1) جدول الملفات الشخصية (يُنشأ تلقائيًا مع كل حساب جديد) ----------
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "المستخدم يشوف ملفه الشخصي فقط"
  on profiles for select using (auth.uid() = id);

create policy "المستخدم يعدّل ملفه الشخصي فقط"
  on profiles for update using (auth.uid() = id);

-- دالة تُنشئ صفًا في profiles تلقائيًا عند تسجيل مستخدم جديد
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- 2) جدول الدورات ----------
create table if not exists courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  subject text not null,          -- فيزياء / رياضيات
  stage text not null,            -- المرحلة الدراسية
  description text,
  price numeric not null default 0,
  trial_days int not null default 3,   -- عدد أيام الفترة المجانية
  created_at timestamptz default now()
);

alter table courses enable row level security;
create policy "الجميع يقدر يشوف الدورات" on courses for select using (true);

-- ---------- 3) جدول فيديوهات كل دورة ----------
create table if not exists course_videos (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  description text,
  youtube_id text not null,   -- يُفضّل أن يكون الفيديو "غير مدرج" (Unlisted) على يوتيوب
  order_index int default 0,
  created_at timestamptz default now()
);

alter table course_videos enable row level security;
-- لا أحد يقرأ الفيديوهات مباشرة من الجدول إلا عبر السيرفر (route handler)
-- الذي يتحقق أولًا من التسجيل الفعّال، لمنع أي وصول مباشر غير مصرّح به.
create policy "لا وصول مباشر - فقط عبر السيرفر" on course_videos for select using (false);

-- ---------- 4) جدول التسجيلات (اشتراك طالب في دورة) ----------
create table if not exists enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  status text not null default 'trial',  -- trial | active | expired
  trial_ends_at timestamptz,
  activated_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, course_id)
);

alter table enrollments enable row level security;
create policy "الطالب يشوف تسجيلاته فقط"
  on enrollments for select using (auth.uid() = user_id);

-- ---------- 5) جدول المدفوعات (سجلّ كل عملية دفع) ----------
create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  course_id uuid references courses(id) on delete cascade not null,
  amount numeric not null,
  provider text not null default 'moyasar',
  provider_payment_id text,
  status text not null default 'pending', -- pending | paid | failed
  created_at timestamptz default now()
);

alter table payments enable row level security;
create policy "الطالب يشوف مدفوعاته فقط"
  on payments for select using (auth.uid() = user_id);

create unique index if not exists payments_provider_payment_id_key
  on payments (provider_payment_id) where provider_payment_id is not null;

-- ---------- بيانات تجريبية (احذفها أو عدّلها لاحقًا) ----------
insert into courses (title, subject, stage, description, price, trial_days) values
  ('فيزياء ثالث ثانوي - نظام المسارات', 'فيزياء', 'ثالث ثانوي', 'مراجعة شاملة تناسب القدرات والتحصيلي', 229, 3)
on conflict do nothing;

-- ================================================================
-- نظام حجز الحصص (خصوصي / جماعي / استشارة) + محتوى الدورات (PDF/فيديو)
-- شغّل هذا الجزء بالكامل مرة واحدة بـ SQL Editor في Supabase
-- ================================================================

-- ---------- 6) جدول المواعيد المتاحة للحجز ----------
create table if not exists session_slots (
  id uuid default gen_random_uuid() primary key,
  type text not null check (type in ('private','group','consultation')), -- خصوصي / جماعي / استشارة
  title text not null,
  starts_at timestamptz not null,
  duration_minutes int not null default 60,
  capacity int not null default 1,        -- عدد المقاعد (أكثر من 1 للحصص الجماعية)
  booked_count int not null default 0,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz default now()
);

alter table session_slots enable row level security;
create policy "الجميع يقدر يشوف المواعيد المتاحة"
  on session_slots for select using (is_active = true);

-- ---------- 7) جدول طلبات الحجز (تحتاج موافقة يدوية من الأدمن) ----------
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  slot_id uuid references session_slots(id) on delete cascade not null,
  type text not null check (type in ('private','group','consultation')),
  status text not null default 'pending' check (status in ('pending','approved','rejected','cancelled')),
  student_note text,
  admin_note text,
  created_at timestamptz default now(),
  decided_at timestamptz
);

alter table bookings enable row level security;
create policy "الطالب يشوف حجوزاته فقط"
  on bookings for select using (auth.uid() = user_id);
create policy "الطالب يقدر يطلب حجز"
  on bookings for insert with check (auth.uid() = user_id);

-- ---------- 8) جدول ملفات الدورات (PDF أو فيديو إضافي) ----------
create table if not exists course_materials (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references courses(id) on delete cascade not null,
  title text not null,
  type text not null default 'pdf' check (type in ('pdf','video')),
  file_path text not null default '',   -- مسار الملف داخل حاوية Storage (لملفات PDF فقط)
  youtube_id text,                       -- يُستخدم فقط إذا كان النوع فيديو
  order_index int default 0,
  created_at timestamptz default now()
);

alter table course_materials enable row level security;
-- لا وصول مباشر من المتصفح - التحميل يمرّ حصرًا عبر route محمي يتحقق من الاشتراك أولًا
create policy "لا وصول مباشر - فقط عبر السيرفر"
  on course_materials for select using (false);

-- ---------- 9) صلاحية الأدمن الحقيقية (منفصلة عن باسورد /admin القديم) ----------
-- بعد ما تسجّل حساب عادي عبر /signup بإيميلك، شغّل السطر التالي (بدّل الإيميل):
-- update profiles set is_admin = true where id = (select id from auth.users where email = 'your@email.com');

create policy "الأدمن يشوف كل الحجوزات"
  on bookings for select using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );
create policy "الأدمن يحدّث الحجوزات"
  on bookings for update using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );
create policy "الأدمن يدير المواعيد"
  on session_slots for all using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );
create policy "الأدمن يدير الملفات"
  on course_materials for all using (
    exists (select 1 from profiles where profiles.id = auth.uid() and profiles.is_admin = true)
  );

-- ---------- 10) حاوية تخزين خاصة لملفات PDF (غير عامة) ----------
insert into storage.buckets (id, name, public)
values ('course-materials', 'course-materials', false)
on conflict (id) do nothing;
-- ملاحظة: كل عمليات الرفع/التحميل لهذه الحاوية تمرّ عبر السيرفر بصلاحيات
-- Service Role فقط (route handlers)، لذلك لا حاجة لسياسات storage.objects إضافية.
