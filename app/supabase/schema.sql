-- ============================================
-- Adyapak Ji — Full Database Schema
-- Based on Master Product Specification
-- ============================================
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- 1. PROFILES (extends Supabase Auth)
-- ──────────────────────────────────────────────
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text CHECK (role IN ('teacher', 'parent', 'admin')) NOT NULL,
  full_name text NOT NULL,
  phone text,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 2. SCHOOLS (multi-school support)
-- ──────────────────────────────────────────────
CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 3. CLASSES
-- ──────────────────────────────────────────────
CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id),
  name text NOT NULL,          -- e.g. "Class 5A"
  level integer NOT NULL,
  teacher_id uuid REFERENCES public.profiles(id),
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 4. STUDENTS (never delete — use status)
-- ──────────────────────────────────────────────
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id),
  class_id uuid REFERENCES public.classes(id),
  admission_number text UNIQUE,
  full_name text NOT NULL,
  roll_number integer NOT NULL,
  status text CHECK (status IN (
    'active', 'repeat', 'left', 'transferred', 'graduated'
  )) DEFAULT 'active',
  photo_url text,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 5. PARENT ↔ STUDENT (many-to-many)
-- ──────────────────────────────────────────────
CREATE TABLE public.parent_student (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.profiles(id),
  student_id uuid REFERENCES public.students(id)
);

-- ──────────────────────────────────────────────
-- 6. ATTENDANCE (core feature)
-- Constraint: one record per student per day
-- ──────────────────────────────────────────────
CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) NOT NULL,
  class_id uuid REFERENCES public.classes(id) NOT NULL,
  date date NOT NULL,
  status text CHECK (status IN ('present', 'absent', 'leave')) NOT NULL,
  marked_by uuid REFERENCES public.profiles(id),
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(student_id, date)
);

-- ──────────────────────────────────────────────
-- 7. ANNOUNCEMENTS
-- ──────────────────────────────────────────────
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES public.profiles(id),
  title text NOT NULL,
  description text,
  type text CHECK (type IN ('text', 'audio', 'file')) DEFAULT 'text',
  audio_url text,
  file_url text,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 8. ANNOUNCEMENT TARGETS (who receives what)
-- ──────────────────────────────────────────────
CREATE TABLE public.announcement_targets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id uuid REFERENCES public.announcements(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id),
  student_id uuid REFERENCES public.students(id)
);

-- ──────────────────────────────────────────────
-- 9. HOLIDAYS
-- ──────────────────────────────────────────────
CREATE TABLE public.holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid REFERENCES public.schools(id),
  name text NOT NULL,
  date date NOT NULL,
  type text CHECK (type IN (
    'festival', 'government', 'school_event', 'emergency'
  )) NOT NULL,
  class_id uuid REFERENCES public.classes(id),  -- NULL = whole school
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 10. HOMEWORK
-- ──────────────────────────────────────────────
CREATE TABLE public.homework (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES public.classes(id),
  title text NOT NULL,
  description text,
  file_url text,
  due_date date,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 11. GALLERY
-- ──────────────────────────────────────────────
CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES public.classes(id),
  title text,
  image_url text NOT NULL,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);

-- ──────────────────────────────────────────────
-- 12. FEES (stub for future)
-- ──────────────────────────────────────────────
CREATE TABLE public.fees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id),
  amount numeric NOT NULL,
  description text,
  due_date date,
  paid boolean DEFAULT false,
  paid_at timestamp WITH TIME ZONE,
  created_at timestamp WITH TIME ZONE DEFAULT now() NOT NULL
);


-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_student ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;


-- ──────────────────────────────────────────────
-- PARENT POLICIES
-- ──────────────────────────────────────────────

-- Parents see only their linked children
CREATE POLICY "parents_see_own_students" ON public.students
  FOR SELECT USING (
    id IN (
      SELECT student_id FROM public.parent_student
      WHERE parent_id = auth.uid()
    )
  );

-- Parents see their own links
CREATE POLICY "parents_see_own_links" ON public.parent_student
  FOR SELECT USING (parent_id = auth.uid());

-- Parents see attendance for their children
CREATE POLICY "parents_see_child_attendance" ON public.attendance
  FOR SELECT USING (
    student_id IN (
      SELECT student_id FROM public.parent_student
      WHERE parent_id = auth.uid()
    )
  );

-- Parents see announcements targeted to their children's classes
CREATE POLICY "parents_see_announcements" ON public.announcements
  FOR SELECT USING (true);  -- filtered via announcement_targets in app

-- Parents see homework for their children's classes
CREATE POLICY "parents_see_homework" ON public.homework
  FOR SELECT USING (
    class_id IN (
      SELECT s.class_id FROM public.students s
      JOIN public.parent_student ps ON ps.student_id = s.id
      WHERE ps.parent_id = auth.uid()
    )
  );

-- Parents see fees for their children
CREATE POLICY "parents_see_fees" ON public.fees
  FOR SELECT USING (
    student_id IN (
      SELECT student_id FROM public.parent_student
      WHERE parent_id = auth.uid()
    )
  );


-- ──────────────────────────────────────────────
-- TEACHER POLICIES
-- ──────────────────────────────────────────────

-- Teachers see students in their classes
CREATE POLICY "teachers_see_class_students" ON public.students
  FOR SELECT USING (
    class_id IN (
      SELECT id FROM public.classes
      WHERE teacher_id = auth.uid()
    )
  );

-- Teachers can insert/update attendance for their classes
CREATE POLICY "teachers_manage_attendance" ON public.attendance
  FOR ALL USING (
    class_id IN (
      SELECT id FROM public.classes
      WHERE teacher_id = auth.uid()
    )
  );

-- Teachers can create announcements
CREATE POLICY "teachers_create_announcements" ON public.announcements
  FOR INSERT WITH CHECK (author_id = auth.uid());

-- Teachers see their own announcements
CREATE POLICY "teachers_see_own_announcements" ON public.announcements
  FOR SELECT USING (author_id = auth.uid());

-- Teachers manage holidays
CREATE POLICY "teachers_manage_holidays" ON public.holidays
  FOR ALL USING (true);  -- scoped by school in app logic

-- Teachers manage homework for their classes
CREATE POLICY "teachers_manage_homework" ON public.homework
  FOR ALL USING (
    class_id IN (
      SELECT id FROM public.classes
      WHERE teacher_id = auth.uid()
    )
  );

-- Gallery is public within a school
CREATE POLICY "gallery_public_read" ON public.gallery
  FOR SELECT USING (true);

-- Teachers can upload gallery photos
CREATE POLICY "teachers_upload_gallery" ON public.gallery
  FOR INSERT WITH CHECK (true);  -- scoped by class in app logic


-- ============================================
-- PROFILE AUTO-CREATION TRIGGER
-- ============================================
-- When a user signs up, auto-create their profile row

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
