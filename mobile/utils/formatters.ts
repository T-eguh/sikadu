import { Role } from '../types/auth';

export const formatRoleLabel = (role?: Role): string => {
  switch (role) {
    case 'ADMIN':
      return 'Administrator';
    case 'TEACHER':
      return 'Guru Pengajar';
    case 'STUDENT':
      return 'Siswa';
    default:
      return 'Pengguna';
  }
};

export const getRoleDashboardPath = (role: Role): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'TEACHER':
      return '/guru/dashboard';
    case 'STUDENT':
      return '/siswa/dashboard';
    default:
      return '/login';
  }
};
