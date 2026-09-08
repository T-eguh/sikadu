import { apiClient } from './api';

export type ModuleStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';
export type ContentType = 'TEXT' | 'DOCUMENT' | 'VIDEO' | 'IMAGE';

export interface ModuleContentItem {
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
  teachingAssignmentId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  teacher?: {
    id: string;
    user: {
      name: string;
      email: string;
      avatar?: string | null;
    };
  };
  class?: {
    id: string;
    name: string;
    grade: number;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  academicYear?: {
    id: string;
    name: string;
    semester: string;
  };
  contents?: ModuleContentItem[];
  totalContents?: number;
  completedContents?: number;
  percentage?: number;
  _count?: {
    contents: number;
  };
}

export interface TeachingAssignmentItem {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
  class: {
    id: string;
    name: string;
    grade: number;
  };
  subject: {
    id: string;
    name: string;
    code: string;
  };
  academicYear: {
    id: string;
    name: string;
    semester: string;
  };
}

export const moduleService = {
  // GURU: Ambil penugasan mengajar
  async getTeacherAssignments(): Promise<TeachingAssignmentItem[]> {
    const res = await apiClient.get('/teaching-assignments/my-assignments');
    return res.data.data;
  },

  // GURU: Modul saya
  async getMyModules(params?: { search?: string; status?: ModuleStatus }): Promise<ModuleItem[]> {
    const res = await apiClient.get('/modules', { params });
    return res.data.data;
  },

  // Detail Modul
  async getModuleById(moduleId: string): Promise<ModuleItem> {
    const res = await apiClient.get(`/modules/${moduleId}`);
    return res.data.data;
  },

  // GURU: Buat modul baru
  async createModule(data: {
    title: string;
    description?: string;
    learningObjectives: string;
    teachingAssignmentId: string;
    thumbnailUrl?: string;
  }): Promise<ModuleItem> {
    const res = await apiClient.post('/modules', data);
    return res.data.data;
  },

  // GURU: Edit modul
  async updateModule(
    moduleId: string,
    data: {
      title?: string;
      description?: string;
      learningObjectives?: string;
      thumbnailUrl?: string;
    }
  ): Promise<{ module: ModuleItem; message: string }> {
    const res = await apiClient.put(`/modules/${moduleId}`, data);
    return res.data;
  },

  // GURU / ADMIN: Ubah status modul
  async updateModuleStatus(
    moduleId: string,
    status: ModuleStatus,
    reviewNotes?: string
  ): Promise<ModuleItem> {
    const res = await apiClient.patch(`/modules/${moduleId}/status`, {
      status,
      reviewNotes,
    });
    return res.data.data;
  },

  // Hapus modul
  async deleteModule(moduleId: string): Promise<void> {
    await apiClient.delete(`/modules/${moduleId}`);
  },

  // KELOLA MATERI (CONTENTS)
  async getContents(moduleId: string): Promise<ModuleContentItem[]> {
    const res = await apiClient.get(`/modules/${moduleId}/contents`);
    return res.data.data;
  },

  async createContent(
    moduleId: string,
    data: {
      title: string;
      description?: string;
      contentType: ContentType;
      textContent?: string;
      fileUrl?: string;
      videoUrl?: string;
      imageUrl?: string;
    }
  ): Promise<ModuleContentItem> {
    const res = await apiClient.post(`/modules/${moduleId}/contents`, data);
    return res.data.data;
  },

  async updateContent(
    contentId: string,
    data: {
      title?: string;
      description?: string;
      contentType?: ContentType;
      textContent?: string;
      fileUrl?: string;
      videoUrl?: string;
      imageUrl?: string;
    }
  ): Promise<ModuleContentItem> {
    const res = await apiClient.put(`/modules/contents/${contentId}`, data);
    return res.data.data;
  },

  async deleteContent(contentId: string): Promise<void> {
    await apiClient.delete(`/modules/contents/${contentId}`);
  },

  async reorderContents(moduleId: string, contentIds: string[]): Promise<ModuleContentItem[]> {
    const res = await apiClient.patch(`/modules/${moduleId}/contents/reorder`, {
      contentIds,
    });
    return res.data.data;
  },

  // SISWA: Modul & Progress
  async getStudentModules(params?: { search?: string }): Promise<ModuleItem[]> {
    const res = await apiClient.get('/student/modules', { params });
    return res.data.data;
  },

  async getStudentModuleDetail(moduleId: string): Promise<ModuleItem> {
    const res = await apiClient.get(`/student/modules/${moduleId}`);
    return res.data.data;
  },

  async toggleStudentProgress(
    moduleId: string,
    contentId: string,
    isCompleted: boolean
  ): Promise<{
    isCompleted: boolean;
    completedAt: string | null;
    stats: { total: number; completed: number; percentage: number };
  }> {
    const res = await apiClient.post(
      `/student/modules/${moduleId}/contents/${contentId}/progress`,
      { isCompleted }
    );
    return res.data.data;
  },
};
