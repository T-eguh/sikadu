export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

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
    studentNumber: string;
    nisn: string;
  } | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface LoginResponseData {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatar: string | null;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
}
