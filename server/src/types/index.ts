export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface JwtPayload {
  userId: string;
  role: UserRole;
  email: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isActive: boolean;
  createdAt: Date;
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

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar: string | null;
  };
}

export type ModuleStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type ContentType = 'TEXT' | 'DOCUMENT' | 'VIDEO' | 'IMAGE';

export interface CreateModuleInput {
  title: string;
  description?: string;
  learningObjectives: string;
  teachingAssignmentId: string;
  thumbnailUrl?: string;
}

export interface UpdateModuleInput {
  title?: string;
  description?: string;
  learningObjectives?: string;
  thumbnailUrl?: string;
}

export interface CreateModuleContentInput {
  title: string;
  description?: string;
  contentType: ContentType;
  textContent?: string;
  fileUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  orderNumber?: number;
}

export interface UpdateModuleContentInput {
  title?: string;
  description?: string;
  contentType?: ContentType;
  textContent?: string;
  fileUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  orderNumber?: number;
}

