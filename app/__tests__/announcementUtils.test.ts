import { buildTargets, isSendDisabled, formatTargetLabel } from '../src/screens/teacher/announcementUtils';

const classes = [
    { id: 'c1', name: 'Class 5A' },
    { id: 'c2', name: 'Class 2B' },
];

describe('announcementUtils', () => {
    test('buildTargets school -> all classes', () => {
        const targets = buildTargets('school', classes as any, [], 'whole', 'c1', []);
        expect(targets).toEqual([{ classId: 'c1' }, { classId: 'c2' }]);
    });

    test('buildTargets multiple classes', () => {
        const targets = buildTargets('classes', classes as any, ['c2'], 'whole', 'c1', []);
        expect(targets).toEqual([{ classId: 'c2' }]);
    });

    test('buildTargets students whole class', () => {
        const targets = buildTargets('students', classes as any, [], 'whole', 'c1', ['s1']);
        expect(targets).toEqual([{ classId: 'c1' }]);
    });

    test('buildTargets students subset', () => {
        const targets = buildTargets('students', classes as any, [], 'subset', 'c1', ['s1', 's2']);
        expect(targets).toEqual([{ studentId: 's1' }, { studentId: 's2' }]);
    });

  test('isSendDisabled guards content and recipients', () => {
    expect(isSendDisabled({ isSending: false, hasContent: false, scope: 'school', studentSelectionMode: 'whole', selectedStudents: [], selectedClassIds: [] })).toBe(true);
    expect(isSendDisabled({ isSending: false, hasContent: true, scope: 'classes', studentSelectionMode: 'whole', selectedStudents: [], selectedClassIds: [] })).toBe(true);
    expect(isSendDisabled({ isSending: false, hasContent: true, scope: 'students', studentSelectionMode: 'subset', selectedStudents: [], selectedClassIds: [] })).toBe(true);
    expect(isSendDisabled({ isSending: false, hasContent: true, scope: 'school', studentSelectionMode: 'whole', selectedStudents: [], selectedClassIds: [] })).toBe(false);
  });

  test('formatTargetLabel handles scopes', () => {
    expect(formatTargetLabel({ scope: 'school', targetClassIds: ['all'] }, classes as any)).toBe('School-wide');
    expect(formatTargetLabel({ scope: 'classes', targetClassIds: ['c1'] }, classes as any)).toBe('Class 5A');
    expect(formatTargetLabel({ scope: 'classes', targetClassIds: ['c1','c2'] }, classes as any)).toBe('2 classes');
    expect(formatTargetLabel({ scope: 'students', targetStudents: ['s1','s2'] }, classes as any)).toBe('2 students');
    expect(formatTargetLabel({ scope: 'students', targetClassId: 'c2' }, classes as any)).toBe('Class 2B • Whole class');
  });
});
