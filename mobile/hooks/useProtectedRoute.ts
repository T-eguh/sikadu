import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './useAuth';
import { Role } from '../types/auth';
import { getRoleDashboardPath } from '../utils/formatters';

export const useProtectedRoute = (allowedRoles: Role[]) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      console.warn(`Access Denied: User role ${user.role} is not in [${allowedRoles.join(', ')}]`);
      router.replace(getRoleDashboardPath(user.role) as any);
    }
  }, [user, isLoading, allowedRoles, router]);

  return {
    isAuthorized: user ? allowedRoles.includes(user.role) : false,
    isLoading,
  };
};
