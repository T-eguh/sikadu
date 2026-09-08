import { apiClient } from './api';
import {
  CreateStudentPayload,
  PaginatedStudentsResponse,
  StudentItem,
  UpdateStudentPayload,
} from '../types/userManagement';

export const StudentService = {
  async getStudents(page = 1, limit = 10, search = ''): Promise<PaginatedStudentsResponse> {
    const params: Record<string, any> = { page, limit };
    if (search.trim()) {
      params.search = search.trim();
    }
    const response = await apiClient.get<PaginatedStudentsResponse>('/students', { params });
    return response.data;
  },

  async getStudentById(id: string): Promise<StudentItem> {
    const response = await apiClient.get<{ success: boolean; data: StudentItem }>(`/students/${id}`);
    return response.data.data;
  },

  async createStudent(payload: CreateStudentPayload): Promise<StudentItem> {
    const response = await apiClient.post<{ success: boolean; data: StudentItem }>('/students', payload);
    return response.data.data;
  },

  async updateStudent(id: string, payload: UpdateStudentPayload): Promise<StudentItem> {
    const response = await apiClient.patch<{ success: boolean; data: StudentItem }>(`/students/${id}`, payload);
    return response.data.data;
  },

  async updateStatus(id: string, isActive: boolean): Promise<StudentItem> {
    const response = await apiClient.patch<{ success: boolean; data: StudentItem }>(`/students/${id}/status`, {
      isActive,
    });
    return response.data.data;
  },

  async resetPassword(id: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.patch<{ success: boolean; message: string }>(
      `/students/${id}/reset-password`,
      { newPassword }
    );
    return response.data;
  },
};
