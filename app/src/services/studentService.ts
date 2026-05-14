import { supabase } from './supabaseClient';

/**
 * Student Service
 * Queries for students, classes, and parent-student relationships.
 * Students are NEVER deleted — use status field instead.
 */

/** Fetch students for a teacher's class */
export async function getStudentsByClass(classId: string) {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .eq('status', 'active')
        .order('roll_number', { ascending: true });

    if (error) throw error;
    return data;
}

/** Fetch children linked to a parent */
export async function getChildrenForParent(parentId: string) {
    const { data, error } = await supabase
        .from('parent_student')
        .select(`
            student_id,
            students (
                id, full_name, roll_number, photo_url, status,
                class_id,
                classes ( id, name )
            )
        `)
        .eq('parent_id', parentId);

    if (error) throw error;
    return data?.map((ps: any) => ps.students) ?? [];
}

/** Link a child to a parent via admission number */
export async function linkChildByAdmission(
    parentId: string,
    admissionNumber: string
) {
    // 1. Find student
    const { data: student, error: findError } = await supabase
        .from('students')
        .select('id')
        .eq('admission_number', admissionNumber)
        .single();

    if (findError) throw new Error('Student not found with this admission number');

    // 2. Check if already linked
    const { data: existing } = await supabase
        .from('parent_student')
        .select('id')
        .eq('parent_id', parentId)
        .eq('student_id', student.id)
        .single();

    if (existing) throw new Error('This child is already linked to your account');

    // 3. Create link
    const { error: linkError } = await supabase
        .from('parent_student')
        .insert({ parent_id: parentId, student_id: student.id });

    if (linkError) throw linkError;
    return student;
}

/** Fetch classes assigned to a teacher */
export async function getClassesForTeacher(teacherId: string) {
    const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('level', { ascending: true });

    if (error) throw error;
    return data;
}
