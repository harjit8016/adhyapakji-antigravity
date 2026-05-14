import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChildStudent, ClassStudent, TeacherClass, Notice, Homework, FeeRecord, Holiday, GalleryImage, AttendanceRecord } from '../types';

interface AppState {
    // Parent State
    myChildren: ChildStudent[];
    setMyChildren: (children: ChildStudent[]) => void;
    activeStudentId: string | null;
    setActiveStudentId: (id: string | null) => void;

    // Teacher State
    teacherClasses: TeacherClass[];
    activeTeacherClassId: string;
    setActiveTeacherClassId: (id: string) => void;
    classStudents: ClassStudent[];
    setClassStudents: (students: ClassStudent[]) => void;
    getActiveClassStudents: () => ClassStudent[];

    // Shared State
    notices: Notice[];
    setNotices: (notices: Notice[]) => void;
    homework: Homework[];
    setHomework: (homework: Homework[]) => void;
    setHomeworkStatus: (id: string, completed: boolean) => void;
    fees: FeeRecord[];
    setFees: (fees: FeeRecord[]) => void;

    // New Infrastructure
    holidays: Holiday[];
    setHolidays: (holidays: Holiday[]) => void;
    gallery: GalleryImage[];
    setGallery: (images: GalleryImage[]) => void;
    offlineAttendance: AttendanceRecord[];
    setOfflineAttendance: (records: AttendanceRecord[]) => void;
}

const initialStudents: ChildStudent[] = [
    { id: '101', classId: 'c1', name: 'Rahul Kumar', className: 'Class 5A', roll: '1' },
    { id: '201', classId: 'c2', name: 'Simran Kaur', className: 'Class 2B', roll: '1' },
];

const class5AStudents: ClassStudent[] = [
    { id: '101', name: 'Rahul Kumar', roll: '1', admissionNo: 'AD101', status: 'active' },
    { id: '102', name: 'Priya Singh', roll: '2', admissionNo: 'AD102', status: 'active' },
    { id: '103', name: 'Amit Patel', roll: '3', admissionNo: 'AD103', status: 'active' },
    { id: '104', name: 'Neha Gupta', roll: '4', admissionNo: 'AD104', status: 'active' },
    { id: '105', name: 'Rohan Mehra', roll: '5', admissionNo: 'AD105', status: 'active' },
    { id: '106', name: 'Sonia Das', roll: '6', admissionNo: 'AD106', status: 'active' },
];

const class2BStudents: ClassStudent[] = [
    { id: '201', name: 'Simran Kaur', roll: '1', admissionNo: 'AD201', status: 'active' },
    { id: '202', name: 'Aarav Gupta', roll: '2', admissionNo: 'AD202', status: 'active' },
    { id: '203', name: 'Ishaan Verma', roll: '3', admissionNo: 'AD203', status: 'active' },
    { id: '204', name: 'Diya Singh', roll: '4', admissionNo: 'AD204', status: 'active' },
];

const initialHomework: Homework[] = [
    { id: 'h1', classId: 'c1', title: 'Maths Chapter 4', description: 'Complete exercises 4.1 and 4.2', dueDate: '2026-10-15', subject: 'Maths' },
    { id: 'h2', classId: 'c1', title: 'Hindi Poem', description: 'Memorize the poem on page 42', dueDate: '2026-10-14', subject: 'Hindi' },
    { id: 'h3', classId: 'c2', title: 'Drawing', description: 'Draw a colorful rangoli design', dueDate: '2026-10-16', subject: 'Art' },
];

const initialFees: FeeRecord[] = [
    { id: 'f1', studentId: '101', amount: 1500, description: 'Tuition Fee - October', dueDate: '2026-10-10', status: 'pending' },
    { id: 'f2', studentId: '201', amount: 1200, description: 'Tuition Fee - October', dueDate: '2026-10-10', status: 'paid', paidDate: '2026-10-05' },
];

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
    // Parent State
    myChildren: initialStudents,
    setMyChildren: (children) => set({ myChildren: children }),
    activeStudentId: '101',
    setActiveStudentId: (id) => set({ activeStudentId: id }),

    // Teacher State
    teacherClasses: [
        { id: 'c1', name: 'Class 5A' },
        { id: 'c2', name: 'Class 2B' }
    ],
    activeTeacherClassId: 'c1',
    setActiveTeacherClassId: (id) => {
        set({ activeTeacherClassId: id });
        // Automatically sync class students when teacher class changes
        set({ classStudents: id === 'c1' ? class5AStudents : class2BStudents });
    },
    classStudents: class5AStudents,
    setClassStudents: (students) => set({ classStudents: students }),
    getActiveClassStudents: () => {
        const students = get().classStudents;
        // Only return students who are active or repeating the year
        return students.filter(s => s.status === 'active' || s.status === 'repeat');
    },

    // Shared State
    notices: [
        { id: '1', titleKey: 'holiday_alert_title', descKey: 'holiday_alert_desc', type: 'audio', date: 'Oct 15', targetClassId: 'all' },
        { id: '2', titleKey: 'fee_deadline_title', descKey: 'fee_deadline_desc', type: 'text', date: 'Oct 10', targetClassId: 'all' }
    ],
    setNotices: (notices) => set({ notices }),
    homework: initialHomework,
    setHomework: (homework) => set({ homework }),
    setHomeworkStatus: (id, completed) => set(state => ({
        homework: state.homework.map(h => h.id === id ? { ...h, completed } : h)
    })),
    fees: initialFees,
    setFees: (fees) => set({ fees }),

    // New State
    holidays: [
        { id: '1', name: 'Diwali', date: '2026-11-12', type: 'festival' },
        { id: '2', name: 'Independence Day', date: '2026-08-15', type: 'government' },
    ],
    setHolidays: (holidays) => set({ holidays }),
    gallery: [
        { id: '1', uri: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d', title: 'School Day', date: '2026-10-01' },
        { id: '2', uri: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', title: 'Annual Day', date: '2026-03-15' },
    ],
    setGallery: (images) => set({ gallery: images }),
    offlineAttendance: [],
    setOfflineAttendance: (records) => set({ offlineAttendance: records }),
        }),
        {
            name: 'adyapak-ji-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                myChildren: state.myChildren,
                activeStudentId: state.activeStudentId,
                teacherClasses: state.teacherClasses,
                activeTeacherClassId: state.activeTeacherClassId,
                classStudents: state.classStudents,
                notices: state.notices,
                homework: state.homework,
                fees: state.fees,
                holidays: state.holidays,
                gallery: state.gallery,
                offlineAttendance: state.offlineAttendance,
            }),
        }
    )
);
