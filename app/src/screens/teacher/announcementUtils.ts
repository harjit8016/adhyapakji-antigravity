import type { TeacherClass } from '../../types';

export type Scope = 'school' | 'classes' | 'students';
export type StudentSelectionMode = 'whole' | 'subset';
export type NoticeLike = {
    scope?: Scope;
    targetClassIds?: string[];
    targetClassId?: string;
    targetStudents?: string[];
};

export function buildTargets(
    scope: Scope,
    teacherClasses: TeacherClass[],
    selectedClassIds: string[],
    studentSelectionMode: StudentSelectionMode,
    studentClassId: string,
    selectedStudentIds: string[],
) {
    if (scope === 'school') {
        return teacherClasses.map((c) => ({ classId: c.id }));
    }
    if (scope === 'classes') {
        return selectedClassIds.map((id) => ({ classId: id }));
    }
    if (studentSelectionMode === 'whole') {
        return [{ classId: studentClassId }];
    }
    return selectedStudentIds.map((id) => ({ studentId: id }));
}

export function isSendDisabled(
    opts: {
        isSending: boolean;
        hasContent: boolean;
        scope: Scope;
        studentSelectionMode: StudentSelectionMode;
        selectedStudents: string[];
        selectedClassIds: string[];
    }
) {
    const { isSending, hasContent, scope, studentSelectionMode, selectedStudents, selectedClassIds } = opts;
    if (isSending) return true;
    if (!hasContent) return true;
    if (scope === 'classes' && selectedClassIds.length === 0) return true;
    if (scope === 'students' && studentSelectionMode === 'subset' && selectedStudents.length === 0) return true;
    return false;
}

export function recipientError(
    scope: Scope,
    studentSelectionMode: StudentSelectionMode,
    selectedStudents: string[],
    selectedClassIds: string[],
    t: (key: string) => string
) {
    if (scope === 'classes' && selectedClassIds.length === 0) return t('announcement_select_classes') || 'Select at least one class';
    if (scope === 'students' && studentSelectionMode === 'subset' && selectedStudents.length === 0) return t('announcement_select_students') || 'Select at least one student';
    return null;
}

export function formatTargetLabel(notice: NoticeLike, teacherClasses: TeacherClass[]) {
    if (notice.scope === 'school' || notice.targetClassIds?.includes('all') || notice.targetClassId === 'all') {
        return 'School-wide';
    }
    if (notice.scope === 'classes') {
        if (notice.targetClassIds && notice.targetClassIds.length === 1) {
            const firstId = notice.targetClassIds[0];
            const cls = firstId ? teacherClasses.find(c => c.id === firstId) : undefined;
            return cls ? cls.name : 'One class';
        }
        if (notice.targetClassIds?.length) return `${notice.targetClassIds.length} classes`;
    }
    if (notice.scope === 'students' && notice.targetStudents?.length) {
        return `${notice.targetStudents.length} students`;
    }
    if (notice.scope === 'students' && notice.targetClassId) {
        const cls = teacherClasses.find(c => c.id === notice.targetClassId);
        return cls ? `${cls.name} • Whole class` : 'Whole Class';
    }
    return 'Specific students';
}
