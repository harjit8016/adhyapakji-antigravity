-- Adyapak Ji PB Supabase Initial Schema

-- 1. Users table (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  role text CHECK (role IN ('teacher', 'parent', 'admin')) NOT NULL,
  full_name text NOT NULL,
  phone_number text UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Classes
CREATE TABLE public.classes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL, -- e.g. "Class 5A"
  level integer NOT NULL,
  teacher_id uuid REFERENCES public.profiles(id)
);

-- 3. Students
-- We don't delete students, we manage their status
CREATE TABLE public.students (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  roll_number text NOT NULL,
  class_id uuid REFERENCES public.classes(id),
  status text CHECK (status IN ('active', 'repeat', 'left', 'transferred', 'graduated')) DEFAULT 'active',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Parent-Student relation (Many to Many)
CREATE TABLE public.parent_student (
  parent_id uuid REFERENCES public.profiles(id),
  student_id uuid REFERENCES public.students(id),
  PRIMARY KEY (parent_id, student_id)
);

-- 5. Attendance
CREATE TABLE public.attendance (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  class_id uuid REFERENCES public.classes(id) NOT NULL,
  date date NOT NULL DEFAULT current_date,
  status text CHECK (status IN ('present', 'absent', 'leave')) NOT NULL,
  recorded_by uuid REFERENCES public.profiles(id),
  UNIQUE(student_id, date) -- One record per student per day
);

-- 6. Announcements
CREATE TABLE public.announcements (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('text', 'audio', 'file')) DEFAULT 'text',
  media_url text, -- For audio/pdf files hosted in Supabase Storage
  target_role text CHECK (target_role IN ('parent', 'all')),
  target_class uuid REFERENCES public.classes(id), -- If null, sent to entire school
  author_id uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Holidays
CREATE TABLE public.holidays (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  holiday_date date NOT NULL,
  type text CHECK (type IN ('government', 'festival', 'emergency', 'school_event')) NOT NULL,
  target_class uuid REFERENCES public.classes(id) -- If null, applies to whole school
);

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Sample Policy: Parents can only select their own children
CREATE POLICY "Parents view own children" ON public.parent_student
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents view child details" ON public.students
  FOR SELECT USING (
    id IN (SELECT student_id FROM public.parent_student WHERE parent_id = auth.uid())
  );
