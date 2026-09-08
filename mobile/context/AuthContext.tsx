import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { User, Role } from '../types/auth';
import { authService } from '../services/authService';
import { storage } from '../utils/secureStore';
import { Config } from '../constants/config';
import { getRoleDashboardPath } from '../utils/formatters';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  login: async () => {},
  logout: async () => {},
  restoreSession: async () => {},
  clearError: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const segments = useSegments();

  // Restore session when app opens: check token in SecureStore, verify with /api/auth/me
  const restoreSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const savedToken = await storage.getToken(Config.tokenKey);

      if (!savedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setToken(savedToken);
      // Verify token with backend
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (err: any) {
      console.warn('Session restoration failed:', err?.message);
      await storage.removeToken(Config.tokenKey);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // Protected Route enforcement based on auth and user role
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'admin' || segments[0] === 'guru' || segments[0] === 'siswa';
    const isLoginPage = segments[0] === 'login';

    if (!user) {
      // If user is not authenticated and trying to access protected screens
      if (inAuthGroup) {
        router.replace('/login');
      }
    } else {
      // User is authenticated
      const userRole = user.role;

      // Prevent unauthorized cross-role access
      if (segments[0] === 'admin' && userRole !== 'ADMIN') {
        router.replace(getRoleDashboardPath(userRole) as any);
      } else if (segments[0] === 'guru' && userRole !== 'TEACHER') {
        router.replace(getRoleDashboardPath(userRole) as any);
      } else if (segments[0] === 'siswa' && userRole !== 'STUDENT') {
        router.replace(getRoleDashboardPath(userRole) as any);
      } else if (isLoginPage) {
        // If already logged in and on login page, redirect to user dashboard
        router.replace(getRoleDashboardPath(userRole) as any);
      }
    }
  }, [user, isLoading, segments, router]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await authService.login(email, password);

      // Save token securely
      await storage.saveToken(Config.tokenKey, data.token);
      setToken(data.token);

      // Fetch complete user profile
      const userProfile = await authService.getMe();
      setUser(userProfile);

      // Navigate to corresponding role dashboard
      const targetPath = getRoleDashboardPath(userProfile.role);
      router.replace(targetPath as any);
    } catch (err: any) {
      const msg = err.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await storage.removeToken(Config.tokenKey);
      setUser(null);
      setToken(null);
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        logout,
        restoreSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
