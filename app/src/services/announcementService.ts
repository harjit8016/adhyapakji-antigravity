import { supabase } from './supabaseClient';

/**
 * Announcement Service
 * Text / Audio / File announcements with targeting (whole class or specific student).
 */

/** Create a new announcement */
export async function createAnnouncement(params: {
    authorId: string;
    title: string;
    description?: string;
    type: 'text' | 'audio' | 'file';
    audioUrl?: string;
    fileUrl?: string;
    targets: { classId?: string; studentId?: string }[];
}) {
    // 1. Insert announcement
    const { data: announcement, error: annError } = await supabase
        .from('announcements')
        .insert({
            author_id: params.authorId,
            title: params.title,
            description: params.description,
            type: params.type,
            audio_url: params.audioUrl,
            file_url: params.fileUrl,
        })
        .select()
        .single();

    if (annError) throw annError;

    // 2. Insert targets
    if (params.targets.length > 0) {
        const targetRows = params.targets.map((t) => ({
            announcement_id: announcement.id,
            class_id: t.classId ?? null,
            student_id: t.studentId ?? null,
        }));

        const { error: targetError } = await supabase
            .from('announcement_targets')
            .insert(targetRows);

        if (targetError) throw targetError;
    }

    return announcement;
}

/** Fetch announcements for a class */
export async function getAnnouncementsForClass(classId: string) {
    const { data, error } = await supabase
        .from('announcement_targets')
        .select(`
            announcement_id,
            announcements (
                id, title, description, type, audio_url, file_url, created_at,
                author_id
            )
        `)
        .eq('class_id', classId)
        .order('created_at', { referencedTable: 'announcements', ascending: false });

    if (error) throw error;
    return data?.map((t: any) => t.announcements) ?? [];
}

/** Fetch announcements targeted at a specific student */
export async function getAnnouncementsForStudent(studentId: string) {
    const { data, error } = await supabase
        .from('announcement_targets')
        .select(`
            announcement_id,
            announcements (
                id, title, description, type, audio_url, file_url, created_at
            )
        `)
        .eq('student_id', studentId)
        .order('created_at', { referencedTable: 'announcements', ascending: false });

    if (error) throw error;
    return data?.map((t: any) => t.announcements) ?? [];
}
