-- Adyapak Ji: Temporary Mock Data Seed Script
-- Run this script directly in your Supabase SQL Editor to populate your database with mock data.
-- This bypasses RLS and allows you to test the app with realistic data.

-- 1. Create a default School
INSERT INTO schools (id, name, address, phone)
VALUES ('00000000-0000-0000-0000-000000000001', 'Adyapak Ji Default School', '123 Village Road, Punjab', '+91 9876543210')
ON CONFLICT (id) DO NOTHING;

-- 2. Create mock Auth Users (we simulate this by directly inserting into public.profiles for testing purposes, but in reality they sign up via Supabase Auth)
-- We will create a Teacher profile and a Parent profile. Note: In a real flow, the `id` would match `auth.users.id`.
INSERT INTO profiles (id, full_name, role, phone, language_preference)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Teacher Ji', 'teacher', '+919999911111', 'pa'),
  ('22222222-2222-2222-2222-222222222222', 'Ramesh Sharma (Parent)', 'parent', '+919999922222', 'hi')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Classes assigned to the Teacher
INSERT INTO classes (id, school_id, name, teacher_id)
VALUES 
  ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Class 5A', '11111111-1111-1111-1111-111111111111'),
  ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Class 2B', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 4. Create Students
INSERT INTO students (id, school_id, class_id, full_name, roll_number, admission_number)
VALUES 
  ('s0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Rahul Kumar', '1', 'ADM-001'),
  ('s0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Priya Singh', '2', 'ADM-002'),
  ('s0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Simran Kaur', '1', 'ADM-003'),
  ('s0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Aarav Gupta', '2', 'ADM-004')
ON CONFLICT (id) DO NOTHING;

-- 5. Link Parent to Students (Ramesh Sharma is parent to Priya and Simran)
INSERT INTO parent_student (parent_id, student_id, relationship)
VALUES 
  ('22222222-2222-2222-2222-222222222222', 's0000000-0000-0000-0000-000000000002', 'father'),
  ('22222222-2222-2222-2222-222222222222', 's0000000-0000-0000-0000-000000000003', 'father')
ON CONFLICT (parent_id, student_id) DO NOTHING;

-- 6. Pre-fill some recent announcements from the Teacher to the whole Class 5A
INSERT INTO announcements (id, school_id, author_id, title, content, type)
VALUES 
  ('a0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Holiday Notice', 'Tomorrow school will remain closed due to heavy rain.', 'text'),
  ('a0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Fee Reminder', 'Please submit the fees for October by the 10th.', 'text')
ON CONFLICT (id) DO NOTHING;

-- 7. Target announcements
-- Announcement 1 is for whole class 5A
INSERT INTO announcement_targets (announcement_id, target_type, target_class_id)
VALUES ('a0000000-0000-0000-0000-000000000001', 'class', 'c0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Announcement 2 is for specific student (Rahul Kumar)
INSERT INTO announcement_targets (announcement_id, target_type, target_student_id)
VALUES ('a0000000-0000-0000-0000-000000000002', 'student', 's0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
