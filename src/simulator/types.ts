export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type StudentStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';
export type AuthProvider = 'LOCAL' | 'GOOGLE';

export interface ClassInvitationCode {
  id: string;
  code: string;
  classId: string;
  className?: string;
  academicYearId: string;
  isActive: boolean;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  isActive: boolean;
  createdAt: string;
  teacher?: {
    id: string;
    teacherNumber: string;
  } | null;
  student?: {
    id: string;
    studentNumber?: string | null;
    nisn?: string | null;
    googleId?: string | null;
    authProvider?: AuthProvider;
    status?: StudentStatus;
    profilePhotoUrl?: string | null;
  } | null;
}

export interface AcademicYear {
  id: string;
  name: string;
  semester: 'GANJIL' | 'GENAP';
  isActive: boolean;
  startDate: string;
  endDate: string;
  _count?: {
    classes?: number;
    teachingAssignments?: number;
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  _count?: {
    teachingAssignments?: number;
  };
}

export interface ClassItem {
  id: string;
  name: string;
  grade: number;
  academicYearId: string;
  academicYear?: {
    id: string;
    name: string;
    semester: string;
  };
  homeroomTeacherId?: string | null;
  homeroomTeacher?: {
    id: string;
    teacherNumber: string;
    user: {
      name: string;
      email: string;
    };
  } | null;
  isActive: boolean;
  students?: Array<{
    id: string;
    classId: string;
    studentId: string;
    student: {
      id: string;
      studentNumber: string;
      nisn: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    };
  }>;
  teachingAssignments?: Array<{
    id: string;
    teacher: {
      user: {
        name: string;
      };
    };
    subject: {
      name: string;
      code: string;
    };
  }>;
  _count?: {
    students?: number;
    teachingAssignments?: number;
  };
}

export interface TeachingAssignment {
  id: string;
  teacherId: string;
  teacher: {
    id: string;
    teacherNumber: string;
    user: {
      name: string;
      email: string;
    };
  };
  classId: string;
  class: {
    id: string;
    name: string;
    grade: number;
    _count?: {
      students?: number;
    };
  };
  subjectId: string;
  subject: {
    id: string;
    name: string;
    code: string;
  };
  academicYearId: string;
  academicYear: {
    id: string;
    name: string;
  };
}

export type DeviceType = 'ios' | 'android';

export type ModuleStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type ContentType = 'TEXT' | 'DOCUMENT' | 'VIDEO' | 'IMAGE';

export interface ModuleContent {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  contentType: ContentType;
  textContent?: string | null;
  fileUrl?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  orderNumber: number;
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
  completedAt?: string | null;
}

export interface ModuleItem {
  id: string;
  title: string;
  description?: string | null;
  learningObjectives: string;
  thumbnailUrl?: string | null;
  status: ModuleStatus;
  teacherId: string;
  teacherName?: string;
  teacherAvatar?: string | null;
  teachingAssignmentId: string;
  classId: string;
  className?: string;
  classGrade?: number;
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  academicYearId: string;
  academicYearName?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  totalContents?: number;
  completedContents?: number;
  percentage?: number;
  contents?: ModuleContent[];
}

