import { apiClient } from './api';
import { ApiResponse, LoginResponseData, User } from '../types/auth';

export const authService = {
  async checkHealth(): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.get<ApiResponse>('/health');
    return response.data;
  },

  async login(email: string, password: string): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', {
      email,
      password,
    });
    if (!response.data.data) {
      throw new Error(response.data.message || 'Data login tidak ditemukan');
    }
    return response.data.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    if (!response.data.data) {
      throw new Error(response.data.message || 'Data pengguna tidak ditemukan');
    }
    return response.data.data;
  },
};
