import { User } from './auth';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TeacherItem extends User {
  teacher: {
    id: string;
    teacherNumber: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface StudentItem extends User {
  student: {
    id: string;
    studentNumber: string;
    nisn: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface PaginatedTeachersResponse {
  success: boolean;
  message: string;
  data: TeacherItem[];
  pagination: PaginationMeta;
}

export interface PaginatedStudentsResponse {
  success: boolean;
  message: string;
  data: StudentItem[];
  pagination: PaginationMeta;
}

export interface CreateTeacherPayload {
  name: string;
  email: string;
  teacherNumber: string;
  password: string;
  avatar?: string;
}

export interface UpdateTeacherPayload {
  name?: string;
  email?: string;
  teacherNumber?: string;
  avatar?: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  studentNumber: string;
  nisn: string;
  password: string;
  avatar?: string;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  studentNumber?: string;
  nisn?: string;
  avatar?: string;
}
