export interface AcademicYearItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    classes: number;
    teachingAssignments: number;
  };
}

export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    teachingAssignments: number;
  };
}

export interface ClassItem {
  id: string;
  name: string;
  grade: string;
  academicYearId: string;
  homeroomTeacherId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  academicYear?: {
    id: string;
    name: string;
    isActive: boolean;
  };
  homeroomTeacher?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
      isActive?: boolean;
    };
  } | null;
  _count?: {
    students: number;
    teachingAssignments: number;
  };
  students?: Array<{
    id: string;
    studentId: string;
    student: {
      id: string;
      studentNumber: string;
      nisn: string;
      user: {
        id: string;
        name: string;
        email: string;
        avatar?: string | null;
        isActive: boolean;
      };
    };
  }>;
  teachingAssignments?: Array<{
    id: string;
    teacher: {
      id: string;
      user: {
        id: string;
        name: string;
        email: string;
        avatar?: string | null;
      };
    };
    subject: {
      id: string;
      name: string;
      code: string;
    };
  }>;
}

export interface TeachingAssignmentItem {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    teacherNumber: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string | null;
      isActive: boolean;
    };
  };
  class: {
    id: string;
    name: string;
    grade: string;
    academicYear?: {
      id: string;
      name: string;
      isActive: boolean;
    };
    _count?: {
      students: number;
    };
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  academicYear: {
    id: string;
    name: string;
    isActive: boolean;
  };
}

export interface TeacherClassItem {
  id: string;
  classId: string;
  className: string;
  grade: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  academicYearId: string;
  academicYearName: string;
  isAcademicYearActive: boolean;
  totalStudents: number;
  students: Array<{
    id: string;
    name: string;
    email: string;
    studentNumber: string;
    nisn: string;
    avatar?: string | null;
  }>;
}

export interface StudentMyClassItem {
  id: string;
  name: string;
  grade: string;
  isActive: boolean;
  academicYear: {
    id: string;
    name: string;
    isActive: boolean;
  };
  homeroomTeacher?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  } | null;
  subjects: Array<{
    id: string;
    subjectName: string;
    subjectCode: string;
    teacherName: string;
  }>;
  classmates: Array<{
    id: string;
    name: string;
    email: string;
    studentNumber: string;
    nisn: string;
    avatar?: string | null;
    isMe: boolean;
  }>;
  totalClassmates: number;
}

export interface AdminDashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalUsers: number;
  totalClasses: number;
  totalSubjects: number;
  totalTeachingAssignments: number;
  activeAcademicYear?: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
  } | null;
  systemStatus: string;
  version: string;
}
