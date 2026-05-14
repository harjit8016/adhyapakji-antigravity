import { supabase } from './supabaseClient';

/**
 * Attendance Service
 * Handles all attendance CRUD operations via Supabase.
 * Constraint: one record per student per day.
 */

/** Save attendance for a class on a given date */
export async function saveAttendance(
    classId: string,
    date: string,
    records: { studentId: string; status: 'present' | 'absent' | 'leave' }[],
    markedBy: string
) {
    // Upsert to handle re-saving on the same day
    const rows = records.map((r) => ({
        student_id: r.studentId,
        class_id: classId,
        date,
        status: r.status,
        marked_by: markedBy,
    }));

    const { data, error } = await supabase
        .from('attendance')
        .upsert(rows, { onConflict: 'student_id,date' })
        .select();

    if (error) throw error;
    return data;
}

/** Fetch attendance for a class on a given date */
export async function getAttendanceByDate(classId: string, date: string) {
    const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('class_id', classId)
        .eq('date', date);

    if (error) throw error;
    return data;
}

/** Fetch attendance history for a student (for parent view) */
export async function getStudentAttendanceHistory(
    studentId: string,
    month?: string
) {
    let query = supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

    // Optional month filter (format: "2026-03")
    if (month) {
        query = query
            .gte('date', `${month}-01`)
            .lt('date', `${month}-32`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
}

/** Check if today is a holiday for a given class / school */
export async function checkHoliday(date: string, classId?: string) {
    let query = supabase
        .from('holidays')
        .select('*')
        .eq('date', date);

    // Check school-wide holidays (class_id is null) OR class-specific
    const { data, error } = await query;
    if (error) throw error;

    // Filter: school-wide (class_id null) or matching class
    return data?.filter(
        (h: any) => h.class_id === null || h.class_id === classId
    ) ?? [];
}
