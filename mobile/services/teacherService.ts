import { apiClient } from './api';
import {
  CreateTeacherPayload,
  PaginatedTeachersResponse,
  TeacherItem,
  UpdateTeacherPayload,
} from '../types/userManagement';

export const TeacherService = {
  async getTeachers(page = 1, limit = 10, search = ''): Promise<PaginatedTeachersResponse> {
    const params: Record<string, any> = { page, limit };
    if (search.trim()) {
      params.search = search.trim();
    }
    const response = await apiClient.get<PaginatedTeachersResponse>('/teachers', { params });
    return response.data;
  },

  async getTeacherById(id: string): Promise<TeacherItem> {
    const response = await apiClient.get<{ success: boolean; data: TeacherItem }>(`/teachers/${id}`);
    return response.data.data;
  },

  async createTeacher(payload: CreateTeacherPayload): Promise<TeacherItem> {
    const response = await apiClient.post<{ success: boolean; data: TeacherItem }>('/teachers', payload);
    return response.data.data;
  },

  async updateTeacher(id: string, payload: UpdateTeacherPayload): Promise<TeacherItem> {
    const response = await apiClient.patch<{ success: boolean; data: TeacherItem }>(`/teachers/${id}`, payload);
    return response.data.data;
  },

  async updateStatus(id: string, isActive: boolean): Promise<TeacherItem> {
    const response = await apiClient.patch<{ success: boolean; data: TeacherItem }>(`/teachers/${id}/status`, {
      isActive,
    });
    return response.data.data;
  },

  async resetPassword(id: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ success: boolean; message: string }>(
      `/teachers/${id}/reset-password`,
      { newPassword }
    );
    return response.data;
  },
};
