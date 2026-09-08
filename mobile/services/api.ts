import axios, { AxiosError } from 'axios';
import { Config } from '../constants/config';
import { storage } from '../utils/secureStore';

export const apiClient = axios.create({
  baseURL: Config.apiUrl,
  timeout: Config.timeout,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if available
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getToken(Config.tokenKey);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Failed to attach token to request header:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error message consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    let errorMessage = 'Terjadi kesalahan jaringan. Periksa koneksi internet Anda.';
    let errorDetails: any[] = [];

    if (error.response) {
      errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
      errorDetails = error.response.data?.errors || [];
    } else if (error.request) {
      errorMessage = 'Tidak dapat terhubung ke server backend. Pastikan server aktif.';
    }

    const enhancedError = new Error(errorMessage) as any;
    enhancedError.status = error.response?.status;
    enhancedError.errors = errorDetails;
    return Promise.reject(enhancedError);
  }
);
