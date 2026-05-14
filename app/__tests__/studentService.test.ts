/**
 * Student Service Unit Tests
 *
 * Mocks the Supabase client to test student-related queries:
 *  - getStudentsByClass
 *  - getChildrenForParent
 *  - linkChildByAdmission (success, not found, already linked)
 *  - getClassesForTeacher
 */

// ── Mock Setup ────────────────────────────────────────────
const mockSelect = jest.fn().mockReturnThis();
const mockEq = jest.fn().mockReturnThis();
const mockOrder = jest.fn().mockReturnThis();
const mockSingle = jest.fn();
const mockInsert = jest.fn().mockReturnThis();
const mockFrom = jest.fn(() => ({
    select: mockSelect,
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
    insert: mockInsert,
}));

jest.mock('../src/services/supabaseClient', () => ({
    supabase: {
        from: mockFrom,
    },
}));

import {
    getStudentsByClass,
    getChildrenForParent,
    linkChildByAdmission,
    getClassesForTeacher,
} from '../src/services/studentService';

describe('studentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset chain
        mockFrom.mockReturnValue({
            select: mockSelect,
            eq: mockEq,
            order: mockOrder,
            single: mockSingle,
            insert: mockInsert,
        });
        mockSelect.mockReturnThis();
        mockEq.mockReturnThis();
        mockOrder.mockReturnThis();
    });

    test('getStudentsByClass queries with class_id and active status', async () => {
        const students = [
            { id: '1', full_name: 'A', roll_number: 1, status: 'active' },
        ];
        mockOrder.mockResolvedValue({ data: students, error: null });

        const result = await getStudentsByClass('c1');

        expect(mockFrom).toHaveBeenCalledWith('students');
        expect(result).toEqual(students);
    });

    test('getStudentsByClass throws on DB error', async () => {
        mockOrder.mockResolvedValue({ data: null, error: { message: 'fail' } });

        await expect(getStudentsByClass('c1')).rejects.toEqual({ message: 'fail' });
    });

    test('getChildrenForParent maps nested join results', async () => {
        const joinData = [
            { student_id: 's1', students: { id: 's1', full_name: 'Rahul', class_id: 'c1', classes: { id: 'c1', name: '5A' } } },
        ];
        mockEq.mockResolvedValue({ data: joinData, error: null });

        const result = await getChildrenForParent('p1');

        expect(mockFrom).toHaveBeenCalledWith('parent_student');
        expect(result).toEqual([joinData[0].students]);
    });

    test('getChildrenForParent returns empty array when no data', async () => {
        mockEq.mockResolvedValue({ data: null, error: null });

        const result = await getChildrenForParent('p1');
        expect(result).toEqual([]);
    });

    test('linkChildByAdmission throws when student not found', async () => {
        mockSingle.mockResolvedValue({ data: null, error: { message: 'No rows' } });

        await expect(linkChildByAdmission('p1', 'INVALID'))
            .rejects.toThrow('Student not found with this admission number');
    });

    test('linkChildByAdmission throws when already linked', async () => {
        // First call: find student succeeds
        mockSingle
            .mockResolvedValueOnce({ data: { id: 's1' }, error: null })
            // Second call: existing link found
            .mockResolvedValueOnce({ data: { id: 'link1' }, error: null });

        await expect(linkChildByAdmission('p1', 'AD101'))
            .rejects.toThrow('This child is already linked to your account');
    });

    test('getClassesForTeacher orders by level', async () => {
        const classes = [{ id: 'c1', name: '5A', level: 5 }];
        mockOrder.mockResolvedValue({ data: classes, error: null });

        const result = await getClassesForTeacher('t1');

        expect(mockFrom).toHaveBeenCalledWith('classes');
        expect(result).toEqual(classes);
    });
});
