import { useAppStore } from '../src/store/appStore';

/**
 * Zustand Store Unit Tests
 *
 * Tests the core state‐management logic:
 *  - Default initial values
 *  - Class switching auto‐syncs classStudents
 *  - getActiveClassStudents filters correctly
 *  - setHomeworkStatus toggles completed
 *  - Basic setters work
 */
describe('appStore', () => {
    beforeEach(() => {
        // Reset Zustand state before every test.
        // Zustand stores created with `create` expose a `setState` API.
        const initial = useAppStore.getState();
        useAppStore.setState(initial, true);
    });

    // ── Defaults ──────────────────────────────────────────────

    test('initial myChildren contains 2 students', () => {
        const { myChildren } = useAppStore.getState();
        expect(myChildren).toHaveLength(2);
        expect(myChildren[0].name).toBe('Rahul Kumar');
    });

    test('initial teacherClasses has Class 5A and Class 2B', () => {
        const { teacherClasses } = useAppStore.getState();
        expect(teacherClasses).toHaveLength(2);
        expect(teacherClasses.map(c => c.name)).toEqual(['Class 5A', 'Class 2B']);
    });

    test('initial activeTeacherClassId is c1', () => {
        expect(useAppStore.getState().activeTeacherClassId).toBe('c1');
    });

    test('initial classStudents belongs to Class 5A (6 students)', () => {
        expect(useAppStore.getState().classStudents).toHaveLength(6);
    });

    // ── Class Switching ───────────────────────────────────────

    test('setActiveTeacherClassId to c2 swaps classStudents to Class 2B roster', () => {
        useAppStore.getState().setActiveTeacherClassId('c2');
        const students = useAppStore.getState().classStudents;
        expect(students).toHaveLength(4);
        expect(students[0].name).toBe('Simran Kaur');
    });

    test('switching back to c1 restores Class 5A roster', () => {
        useAppStore.getState().setActiveTeacherClassId('c2');
        useAppStore.getState().setActiveTeacherClassId('c1');
        expect(useAppStore.getState().classStudents).toHaveLength(6);
    });

    // ── Active Student Filtering ──────────────────────────────

    test('getActiveClassStudents filters out non-active/repeat statuses', () => {
        // Inject a student with status = "left"
        useAppStore.setState({
            classStudents: [
                { id: '1', name: 'A', roll: '1', admissionNo: 'X1', status: 'active' },
                { id: '2', name: 'B', roll: '2', admissionNo: 'X2', status: 'left' },
                { id: '3', name: 'C', roll: '3', admissionNo: 'X3', status: 'repeat' },
            ]
        });
        const active = useAppStore.getState().getActiveClassStudents();
        expect(active).toHaveLength(2);
        expect(active.map(s => s.id)).toEqual(['1', '3']);
    });

    // ── Homework ──────────────────────────────────────────────

    test('setHomeworkStatus toggles completed flag', () => {
        const hw = useAppStore.getState().homework;
        expect(hw[0].completed).toBeUndefined();
        useAppStore.getState().setHomeworkStatus('h1', true);
        expect(useAppStore.getState().homework[0].completed).toBe(true);
        useAppStore.getState().setHomeworkStatus('h1', false);
        expect(useAppStore.getState().homework[0].completed).toBe(false);
    });

    // ── Setters ───────────────────────────────────────────────

    test('setNotices replaces notices array', () => {
        useAppStore.getState().setNotices([]);
        expect(useAppStore.getState().notices).toEqual([]);
    });

    test('setHolidays replaces holidays array', () => {
        useAppStore.getState().setHolidays([{ id: 'x', name: 'Test', date: '2026-01-01', type: 'festival' }]);
        expect(useAppStore.getState().holidays).toHaveLength(1);
        expect(useAppStore.getState().holidays[0].name).toBe('Test');
    });

    test('setGallery replaces gallery array', () => {
        useAppStore.getState().setGallery([]);
        expect(useAppStore.getState().gallery).toEqual([]);
    });

    test('setFees replaces fees array', () => {
        useAppStore.getState().setFees([]);
        expect(useAppStore.getState().fees).toEqual([]);
    });

    test('setMyChildren replaces children', () => {
        useAppStore.getState().setMyChildren([]);
        expect(useAppStore.getState().myChildren).toEqual([]);
    });

    test('setActiveStudentId updates active student', () => {
        useAppStore.getState().setActiveStudentId('201');
        expect(useAppStore.getState().activeStudentId).toBe('201');
    });
});
