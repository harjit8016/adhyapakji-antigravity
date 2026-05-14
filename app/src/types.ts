// ─── Data Types ───────────────────────────────────────────

/** A student linked to a parent (parent-side view) */
export interface ChildStudent {
    id: string;
    classId: string;
    name: string;
    className: string;
    roll: string;
}

/** A student within a teacher's class roster */
export interface ClassStudent {
    id: string;
    name: string;
    roll: string;
    admissionNo: string;
    status: 'active' | 'repeat' | 'left' | 'transferred' | 'graduated';
    photo?: string;
}

/** A teacher-managed class */
export interface TeacherClass {
    id: string;
    name: string;
}

/** A notice / announcement */
export interface Notice {
    id: string;
    titleKey?: string; // used for translated system notices
    descKey?: string;  // used for translated system notices
    titleRaw?: string; // used for custom teacher notices
    descRaw?: string;  // used for custom teacher notices
    type: 'audio' | 'text' | 'file';
    date: string;
    audioUri?: string;
    imageUri?: string;
    scope?: 'school' | 'classes' | 'students';
    targetClassId?: string;  // legacy single class
    targetClassIds?: string[]; // multiple classes
    targetStudents?: string[]; // if targeting specific students
}

/** A gallery image */
export interface GalleryImage {
    id: string;
    uri: string;
    title: string;
    date: string;
}

/** A holiday */
export interface Holiday {
    id: string;
    name: string;
    date: string;
    type: 'festival' | 'government' | 'school_event' | 'emergency';
    targetClassId?: string;
}

/** Detailed Attendance Record for offline sync */
export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string;
    status: 'present' | 'absent' | 'leave';
    markedBy: string;
    synced: boolean;
}

/** Homework assignment */
export interface Homework {
    id: string;
    classId: string;
    title: string;
    description: string;
    dueDate: string;
    subject: string;
    completed?: boolean;
    attachments?: string[];
}

/** Fee record */
export interface FeeRecord {
    id: string;
    studentId: string;
    amount: number;
    description: string;
    dueDate: string;
    status: 'paid' | 'pending';
    paidDate?: string;
}

// ─── Context Types ────────────────────────────────────────

export interface MockAppContextType {
    myChildren: ChildStudent[];
    setMyChildren: React.Dispatch<React.SetStateAction<ChildStudent[]>>;
    activeStudentId: string | null;
    setActiveStudentId: React.Dispatch<React.SetStateAction<string | null>>;
    classStudents: ClassStudent[];
    setClassStudents?: React.Dispatch<React.SetStateAction<ClassStudent[]>>; // Optional for now
    notices: Notice[];
    setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
    teacherClasses: TeacherClass[];
    activeTeacherClassId: string;
    setActiveTeacherClassId: React.Dispatch<React.SetStateAction<string>>;
    homework: Homework[];
    setHomework: React.Dispatch<React.SetStateAction<Homework[]>>;
    fees: FeeRecord[];
    setFees: React.Dispatch<React.SetStateAction<FeeRecord[]>>;
}

// ─── Navigation Types ─────────────────────────────────────

export type AuthStackParamList = {
    LanguageSelection: undefined;
    PhoneLogin: undefined;
    OTPVerification: { phone: string };
    RoleSelection: undefined;
};

export type ParentStackParamList = {
    StudentSelection: undefined;
    ParentSetup: undefined;
    LinkChild: undefined;
    ParentDashboard: undefined;
    CommunicationFeed: undefined;
    SchoolGallery: undefined;
    HomeworkScreen: undefined;
    FeesScreen: undefined;
    AttendanceHistory: undefined;
    AnnouncementDetail: undefined;
    Profile: undefined;
};
export type TeacherStackParamList = {
    TeacherTabs: undefined;
    ClassSelection: undefined;
    HolidayManagement: undefined;
    TeacherAnnouncements: undefined;
    AddStudentScreen: undefined;
    FeesCollectionScreen: undefined;
    AddHoliday: undefined;
    UploadGalleryImage: undefined;
    StudentProfile: undefined;
};
